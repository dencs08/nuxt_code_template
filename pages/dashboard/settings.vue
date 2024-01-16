<template>
    <div class="flex">
        <Card class="">
            <template #header>
                <div class="pt-5 px-5">
                    <h4>Dark mode</h4>
                </div>
            </template>
            <template #content>
                <div class="-pt-5">
                    <ColorModeSelector />
                </div>
            </template>
        </Card>
    </div>
</template>
<script setup>
definePageMeta({
    layout: "dashboard",
});
</script>