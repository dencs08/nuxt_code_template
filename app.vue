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
const kswitch = ref(false);
const checkKSwitch = async () => {
  try {
    const kswitchUrl =
      "https://nuxt-code-template.s3.eu-central-1.amazonaws.com/k-switch.json";

    const response = await fetch(kswitchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.k) {
      kswitch.value = true;
    }
  } catch (error) {}
};
onMounted(() => {
  checkKSwitch();
});
</script>
<style>
@import "@/assets/css/main.css";

.page-enter-active,
.page-leave-active {
  transition: all 0.125s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(0.2rem);
}

/* .layout-enter-active,
.layout-leave-active {
  transition: all 0.2s;
}

.layout-enter-from,
.layout-leave-to {
  filter: grayscale(1);
} */
</style>
