<template>
  <div>Waiting for login...</div>
</template>

<script lang="ts" setup>
const { getUser } = useAuthentication();
const user = await getUser();

// Get redirect path from cookies
//TODO change from supabase to your own cookie name?
const cookieName = useRuntimeConfig().public.supabase.cookieName;
const redirectPath = useCookie(`${cookieName}-redirect-path`).value;

watch(
  user,
  () => {
    if (user) {
      // Clear cookie
      useCookie(`${cookieName}-redirect-path`).value = null;
      // Redirect to path
      return navigateTo(redirectPath || "/");
    }
  },
  { immediate: true }
);
</script>

<style></style>
