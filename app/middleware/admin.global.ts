export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) {
    return
  }

  if (to.path === '/admin/login') {
    const { ensureAdmin } = useAdminAuth()

    if (await ensureAdmin()) {
      return navigateTo('/admin')
    }

    return
  }

  const { ensureAdmin } = useAdminAuth()

  if (!(await ensureAdmin())) {
    return navigateTo('/admin/login')
  }
})
