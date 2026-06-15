/**
 * Script to recursively update Cache-Control headers for existing assets in the Supabase Storage bucket.
 * Requires SUPABASE_SERVICE_ROLE_KEY and SUPABASE_URL in .env.
 * 
 * Usage: node scripts/update-storage-cache.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const MEDIA_BUCKET = 'media'
const TARGET_CACHE_CONTROL = '31536000' // 1 year

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env')
  const env = { ...process.env }

  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx === -1) continue
      env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1).replace(/^["']|["']$/g, '')
    }
  }

  return env
}

async function walkAndCollectFiles(supabase, folderPath = '') {
  const files = []
  
  const { data, error } = await supabase.storage.from(MEDIA_BUCKET).list(folderPath, {
    limit: 100,
  })
  
  if (error) {
    throw error
  }
  
  for (const item of data) {
    const fullPath = folderPath ? `${folderPath}/${item.name}` : item.name
    
    // In Supabase Storage list, folders do not have metadata or id.
    if (!item.id || !item.metadata) {
      // It's a folder, recurse
      const filesInFolder = await walkAndCollectFiles(supabase, fullPath)
      files.push(...filesInFolder)
    } else {
      // It's a file
      files.push({
        path: fullPath,
        contentType: item.metadata.mimetype,
        cacheControl: item.metadata.cacheControl,
      })
    }
  }
  
  return files
}

async function main() {
  const env = loadEnv()
  const url = env.SUPABASE_URL || env.NUXT_PUBLIC_SUPABASE_URL
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    console.error('Missing SUPABASE_URL/NUXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
    process.exit(1)
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  console.log(`Scanning storage bucket "${MEDIA_BUCKET}" for existing files...`)
  let files = []
  try {
    files = await walkAndCollectFiles(supabase)
  } catch (err) {
    console.error('Failed to list files in bucket:', err.message || err)
    process.exit(1)
  }

  console.log(`Found ${files.length} files in bucket.`)

  const filesToUpdate = files.filter(f => f.cacheControl !== TARGET_CACHE_CONTROL)
  
  if (filesToUpdate.length === 0) {
    console.log('All files already have the correct Cache-Control header.')
    return
  }

  console.log(`Updating ${filesToUpdate.length} files that do not have the target Cache-Control: ${TARGET_CACHE_CONTROL}...`)

  for (const file of filesToUpdate) {
    console.log(`Processing: ${file.path} (Current cache-control: "${file.cacheControl || 'none'}")`)
    
    try {
      // 1. Download existing file
      const { data: fileBody, error: downloadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .download(file.path)
        
      if (downloadError) {
        throw downloadError
      }
      
      // 2. Upload/Update file with new Cache-Control metadata
      const { error: updateError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .update(file.path, fileBody, {
          cacheControl: TARGET_CACHE_CONTROL,
          upsert: true,
          contentType: file.contentType || 'application/octet-stream',
        })
        
      if (updateError) {
        throw updateError
      }
      
      console.log(`Successfully updated Cache-Control for ${file.path}`)
    } catch (err) {
      console.error(`Error updating file ${file.path}:`, err.message || err)
    }
  }

  console.log('Finished updating existing assets.')
}

main().catch((error) => {
  console.error('Process failed:', error.message || error)
  process.exit(1)
})
