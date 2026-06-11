import type { Tables } from '~/types/database.types'

export type AdminProfile = Tables<'profiles'>

const ADMIN_ROLE = 'admin'

export function useAdminAuth() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const profile = useState<AdminProfile | null>('admin-profile', () => null)
  const loading = useState('admin-auth-loading', () => false)
  const initialized = useState('admin-auth-initialized', () => false)

  const isAdmin = computed(() => profile.value?.role === ADMIN_ROLE)

  async function getProfile(userId?: string): Promise<AdminProfile | null> {
    let resolvedUserId = userId

    if (!resolvedUserId) {
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()

      if (userError || !currentUser) {
        profile.value = null
        return null
      }

      resolvedUserId = currentUser.id
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', resolvedUserId)
      .maybeSingle()

    if (error) {
      console.error('[useAdminAuth] Failed to load profile:', error.message)
      profile.value = null
      return null
    }

    if (!data) {
      profile.value = null
      return null
    }

    profile.value = data
    return data
  }

  async function ensureAdmin(): Promise<boolean> {
    const currentProfile = await getProfile()
    initialized.value = true
    return currentProfile?.role === ADMIN_ROLE
  }

  async function login(email: string, password: string): Promise<{ error: string | null }> {
    loading.value = true

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        return { error: signInError.message }
      }

      if (!signInData.user) {
        return { error: 'Unable to sign in. Please try again.' }
      }

      const currentProfile = await getProfile(signInData.user.id)

      if (currentProfile?.role !== ADMIN_ROLE) {
        await supabase.auth.signOut()
        profile.value = null
        return { error: 'You are not authorized to access the admin area.' }
      }

      initialized.value = true
      return { error: null }
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    loading.value = true

    try {
      await supabase.auth.signOut()
      profile.value = null
      initialized.value = false
      await navigateTo('/admin/login')
    } finally {
      loading.value = false
    }
  }

  watch(user, (currentUser) => {
    if (!currentUser) {
      profile.value = null
      initialized.value = false
    }
  })

  return {
    user,
    profile: readonly(profile),
    loading: readonly(loading),
    initialized: readonly(initialized),
    isAdmin,
    login,
    logout,
    getProfile,
    ensureAdmin,
  }
}
