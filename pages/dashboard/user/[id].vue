<template>
    <div>
        <!-- <SubNavbar :links="links" /> -->
        <NuxtPage />
    </div>
</template>
<script setup>
definePageMeta({
    layout: "dashboard",
});

const routeParams = { ...useRoute().params };

const links = [
    {
        text: 'Overview',
        to: 'DashboardRecruitmentIndex',
    },
]
</script>
<style lang="">
    
</style>