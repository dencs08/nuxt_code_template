<template>
  <div
      class="scrollable-container pb-3"
      :class="{ 'is-scrollable': isScrollable }"
  >
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

const windowWidth = ref(window.innerWidth)
const isScrollable = computed(() => windowWidth.value <= props.breakpoint)

let resizeHandler

onMounted(() => {
  resizeHandler = () => {
    windowWidth.value = window.innerWidth
  }

  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
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
