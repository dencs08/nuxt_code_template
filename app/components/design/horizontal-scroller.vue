<template>
  <div class="scrollable-container pb-3" :class="{ 'is-scrollable': isScrollable }">
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  breakpoint: {
    type: Number,
    default: 0
  }
})

let resizeHandler

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)
const isScrollable = computed(() => windowWidth.value <= props.breakpoint)

onMounted(() => {
  if (typeof window !== 'undefined') {
    resizeHandler = () => {
      windowWidth.value = window.innerWidth
    }

    window.addEventListener('resize', resizeHandler)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', resizeHandler)
  }
})

defineExpose({
  isScrollable
})
</script>

<style scoped>
.scrollable-container {
  width: 100%;
  overflow-x: hidden;
}

.scrollable-container.is-scrollable {
  overflow-x: scroll;
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
}
</style>
