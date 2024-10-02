<template>
  <NuxtPage />
</template>
<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

const localePath = useLocalePath();
navigateTo(localePath({ name: "dash-home" }), { replace: true });
onBeforeMount(() => {
  navigateTo(localePath({ name: "dash-home" }), { replace: true });
});
onMounted(() => {
  navigateTo(localePath({ name: "dash-home" }), { replace: true });
});
</script>
