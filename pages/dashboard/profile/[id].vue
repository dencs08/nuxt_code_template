<template lang="">
    <div>
        <SubNavbar :links="links" />
        <NuxtPage/>
    </div>
</template>
<script setup>
definePageMeta({
    layout: "dashboard",
});
const routeParams = { ...useRoute().params };

const links = [
    // {
    //     text: 'Details',
    //     to: { name: 'DashboardProfileIndex', params: { id: 1 } },
    // },
]
</script>
<style lang="">
    
</style>