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
  layout: "default",
  middleware: "verify-access-token",
});

const { getUser } = useAuthentication();
const user = await getUser();
const localePath = useLocalePath();

watch(
  user,
  async () => {
    if (user) {
      console.log("User found in watch");
      setTimeout(() => {
        console.log("Navigating to main page");
        navigateTo(localePath("/main"), {
          replace: true,
          external: true,
        });
      }, 2500);
    }
  },
  { immediate: true }
);
</script>

<style></style>
