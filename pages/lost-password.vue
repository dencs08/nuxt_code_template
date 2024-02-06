<script setup lang="ts">
</script>

<template>
  <section class="flex h-[80vh] flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <PasswordReset />
    </div>
  </section>
</template>

<style lang="scss" scoped>
:deep(.p-steps) {
  .p-menuitem-link {
    background-color: transparent !important;

    &:focus {
      outline: none !important;
      box-shadow: none !important;
    }
  }

  .p-steps-title {
    opacity: 0;
  }

  .p-steps-number {
    background: #f8f8f8 !important;
    font-size: 0.85rem !important;
  }
}
</style>