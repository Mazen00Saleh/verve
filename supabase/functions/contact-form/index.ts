import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type ContactPayload = {
  name?: string
  email?: string
  message?: string
  website?: string
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  try {
    const payload = await request.json() as ContactPayload

    if (payload.website) {
      return jsonResponse({ success: true })
    }

    const name = payload.name?.trim() ?? ''
    const email = payload.email?.trim() ?? ''
    const message = payload.message?.trim() ?? ''

    if (!name || name.length > 120) {
      return jsonResponse({ error: 'Please provide a valid name.' }, 400)
    }

    if (!email || !isValidEmail(email) || email.length > 254) {
      return jsonResponse({ error: 'Please provide a valid email address.' }, 400)
    }

    if (!message || message.length < 10 || message.length > 5000) {
      return jsonResponse({ error: 'Message must be between 10 and 5000 characters.' }, 400)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse({ error: 'Server configuration error.' }, 500)
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { error: insertError } = await supabase
      .from('contact_submissions')
      .insert({ name, email, message })

    if (insertError) {
      throw insertError
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const toEmail = Deno.env.get('CONTACT_TO_EMAIL') ?? 'info@verve-group.com'
    const fromEmail = Deno.env.get('CONTACT_FROM_EMAIL') ?? 'Verve Contact <onboarding@resend.dev>'

    if (resendApiKey) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email,
          subject: `New Verve contact message from ${name}`,
          html: `
            <h2>New contact form submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Message:</strong></p>
            <p>${escapeHtml(message).replaceAll('\n', '<br>')}</p>
          `,
        }),
      })

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text()
        console.error('Resend API error:', errorText)
      }
    }

    return jsonResponse({ success: true })
  } catch (error) {
    console.error('contact-form error:', error)

    return jsonResponse({
      error: error instanceof Error ? error.message : 'Failed to send message.',
    }, 500)
  }
})
