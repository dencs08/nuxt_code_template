<template></template>
<script setup lang=ts>
definePageMeta({
    layout: "dashboard",
});

const localePath = useLocalePath();
navigateTo(localePath({ name: "dash-home" }));
</script>