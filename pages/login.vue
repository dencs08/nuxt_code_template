<script setup lang="ts">
definePageMeta({
  auth: {
    // unauthenticatedOnly: true,
    // navigateAuthenticatedTo: '/dashboard',
  }
})
</script>

<template>
  <section class="h-screen">
    <div class="h-full overflow-hidden">
      <AuthorizationLogin/>
    </div>
  </section>
</template>
