<template>
  <div>
    <ConfirmActionDialog
      v-model:visible="isVisible"
      :config="config"
      @confirm="handleConfirm"
      @reject="handleReject"
      :isLoading="isLoading"
    />
    <ConfirmPopup group="popup"></ConfirmPopup>
    <ConfirmDialog group="dialog"></ConfirmDialog>
  </div>
</template>
<script setup lang="ts">
const { isVisible, config, handleConfirm, handleReject, isLoading } =
  useConfirmAction();
</script>
