<template>
  <div class="min-h-screen flex flex-col selection:bg-luxury-brass selection:text-luxury-matte-black">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <AppHeader />
    <main id="main-content" class="flex-grow">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
