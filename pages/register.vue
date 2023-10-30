<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/dashboard/home'
  }
})

const customFunction = (event, session) => {
  window.location.reload();
};
const {handleAuthStateChange} = useAuthListeners();
handleAuthStateChange('SIGNED_IN', customFunction)
</script>

<template>
  <section class="flex h-[80vh] flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <AuthorizationRegister/>
    </div>
  </section>
</template>
