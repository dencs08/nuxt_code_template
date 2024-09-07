<script setup lang="ts">
import type { RoutesNamesList } from "@typed-router/__routes";

definePageMeta({
  layout: "dashboard",
});

const localePath = useLocalePath();
const verifiedToken = useCookie("verified_token");

const { generalPage } = useRedirections();

if (verifiedToken.value) {
  verifiedToken.value = null;
} else {
  navigateTo(localePath({ name: generalPage() as RoutesNamesList }), {
    replace: true,
  });
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
