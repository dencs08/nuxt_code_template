<template>
  <Kswitch v-if="kswitch" />
  <div v-else>
    <NuxtLoadingIndicator :height="7" />
    <GlobalComponents />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { initializeApp } from "@/core/utils/initializeApp";

const kswitch = ref(false);

onMounted(async () => {
  const { isKSwitchActive } = await initializeApp();
  kswitch.value = isKSwitchActive;
});
</script>

<style>
@import "@/core/assets/css/main.css";

.page-enter-active,
.page-leave-active {
  transition: all 100ms ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(0.2rem);
}
</style>
