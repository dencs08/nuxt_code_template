<template></template>
<script setup lang=ts>
definePageMeta({
    layout: "dashboard",
});

const localePath = useLocalePath();
onMounted(() => {
    navigateTo(localePath("/dashboard/home'"));
});
</script>
<style lang="">
    
</style>