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
import type { RoutesNamesList } from "@typed-router/__routes";

definePageMeta({
  layout: "default",
  middleware: "check-reset-token",
});

const { getUser } = useAuthentication();
const user = await getUser();
const localePath = useLocalePath();

const { passwordChangePage } = useRedirections();

watch(
  user,
  () => {
    if (user) {
      setTimeout(() => {
        // TODO set this path somewhere centralized as it can change during development and production.
        navigateTo(
          localePath({ name: passwordChangePage() as RoutesNamesList })
        );
      }, 2500);
    }
  },
  { immediate: true }
);
</script>

<style></style>
