<script setup lang="ts">
// TODO problem with this approach it is not validating the token on the server side because it was invalidated on the check-reset-token to authenticate the user - in the future probably we need to change this approach
definePageMeta({
  layout: "dashboard",
});

const localePath = useLocalePath();
const verifiedToken = useCookie("verified_token");

if (verifiedToken.value) {
  verifiedToken.value = null;
} else {
  navigateTo(localePath({ name: "index" }));
}
</script>

<template>
  <section
    class="flex h-[80vh] flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md h-3/5">
      <PasswordUpdate />
    </div>
  </section>
</template>
