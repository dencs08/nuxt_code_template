<template>
    <Transition name="fade" :duration="75" mode="out-in">
        <div v-if="props.loading">
            <AnimatedPlaceholder class="h-full w-full rounded-lg py-5 px-6" />
        </div>
        <div v-else class="px-6 py-5 rounded-lg" :class="[styling, { 'shadow-sm': shadow }]">
          <slot />
        </div>
    </Transition>
</template>
<script lang="ts" setup>
const props = defineProps({
    shadow: {
        type: Boolean,
        default: true,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    styling:{
      type: String,
      default: 'bg-white border border-gray-200'
    }
})
</script>
<style lang="">
    
</style>