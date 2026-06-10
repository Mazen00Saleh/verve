<template>
  <div class="min-h-screen flex flex-col selection:bg-luxury-brass selection:text-luxury-matte-black">
    <AppHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
