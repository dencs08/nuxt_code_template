<template></template>
<script setup lang=ts>
definePageMeta({
    layout: "dashboard",
});

const localePath = useLocalePath();
navigateTo(localePath("/dashboard/home"));
</script>