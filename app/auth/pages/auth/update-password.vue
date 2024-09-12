<script setup lang="ts">
import type { RoutesNamesList } from "@typed-router/__routes";

definePageMeta({
  layout: "none",
  middleware: "is-password-reset-token-active",
});
</script>

<template>
  <section
    class="flex h-screen flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 -mt-10"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <PasswordUpdateForm />
    </div>
  </section>
</template>
