export default defineNuxtRouteMiddleware(async () => {
  const { ensureAdmin } = useAdminAuth()
  const authorized = await ensureAdmin()

  if (!authorized) {
    return navigateTo('/admin/login')
  }
})
