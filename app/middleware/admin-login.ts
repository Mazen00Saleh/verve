export default defineNuxtRouteMiddleware(async () => {
  const { ensureAdmin } = useAdminAuth()

  if (await ensureAdmin()) {
    return navigateTo('/admin')
  }
})
