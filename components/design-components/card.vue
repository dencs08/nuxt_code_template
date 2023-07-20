<template>
    <Transition name="fade" :duration="125" mode="out-in">
        <div v-if="props.loading">
            <AnimatedPlaceholder class="h-full w-full rounded-lg py-5 px-6" />
        </div>
        <div v-else class="bg-white px-6 py-5 border border-gray-200 rounded-lg" :class="{ 'shadow-sm': shadow }">
            <slot />
        </div>
    </Transition>
</template>
<script lang="ts" setup>
const props = defineProps({
    shadow: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    }
})
</script>
<style lang="">
    
</style>