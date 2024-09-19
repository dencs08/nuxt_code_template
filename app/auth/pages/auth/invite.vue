<template>
  <div
    class="h-screen w-screen flex flex-col justify-center items-center gap-4 overflow-hidden"
  >
    <Logo type="logotype" color="black" height="50px" width="150px" />
    <h1 class="text-2xl font-bold">Veryfing your account, please wait..</h1>
    <div class="w-1/2">
      <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "none",
  middleware: "verify-access-token",
});

const { getUser } = useAuthentication();
const user = await getUser();
const localePath = useLocalePath();
const { welcomePage } = useRedirections();
watch(
  user,
  async () => {
    if (user) {
      console.log("User found in watch");
      try {
        await $fetch("/api/v1/me/first-login/set-first-login-flag", {
          method: "POST",
        });

        setTimeout(() => {
          navigateTo(localePath(welcomePage()), {
            replace: true,
          });
        }, 3500);
      } catch (error) {
        console.error("Error setting verification flag:", error);
      }
    }
  },
  { immediate: true }
);
</script>

<style></style>
