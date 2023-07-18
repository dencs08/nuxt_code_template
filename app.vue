<template>
  <div>
    <Toast />
    <NuxtLayout class="bg-gray-50">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>

</script>
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.25s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(.2rem);
}
</style>