<template>
  <nuxt-img :src="src" :quality="quality" :sizes="sizes" :format="format" :loading="loading" :placeholder="placeholder"
    class="h-full w-full object-cover" />
</template>

<script lang="ts" setup>
const props = defineProps({
  src: {
    type: String,
    default: 'img/placeholder.jpg'
  },
  quality: {
    type: Number,
    default: 50
  },
  sizes: {
    type: String,
    default: '300px sm:400px md:600px lg:750px xl:1280px'
  },
  format: {
    type: String,
    default: 'webp'
  },
  loading: {
    type: String as () => "lazy" | "eager",
    default: 'lazy'
  },
  placeholder: {
    type: Array,
    default: () => [100, 100, 5, 5]
  }
})
</script>

<style></style>