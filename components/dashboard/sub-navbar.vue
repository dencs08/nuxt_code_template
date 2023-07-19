<template>
    <div class="flex mb-2">
        <div v-for="(link, index) in  links " :key="index"
            :class="[index !== links.length - 1 ? 'border-r border-gray-200 pr-4 mr-4' : '']">
            <CardLink :to="link.to" :noIcon="true">{{ link.text }}</CardLink>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    links: {
        type: Array,
        default: () => [],
    },
})
</script>
<style lang="">
    
</style>