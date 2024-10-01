<template>
  <div v-for="(item, index) in config.message" :key="index" class="mt-4">
    <div class="flex gap-1">
      <p class="font-semibold text-surface-700 dark:text-surface-50">
        {{ item.displayName }}
      </p>
    </div>
    <ul class="list-decimal list-inside">
      <li
        v-for="(change, i) in item.changes"
        :key="i"
        class="flex items-center gap-2 ml-2"
      >
        <i class="pi pi-circle-fill text-primary-500 text-[4px]"></i>
        <p class="text-surface-600 dark:text-surface-200">{{ change.key }}:</p>
        <p class="text-surface-700 dark:text-surface-0 font-bold">
          {{ change.oldValue }}
        </p>
        <i class="pi pi-arrow-right text-xs text-primary-500"></i>
        <p class="text-surface-700 dark:text-surface-0 font-bold">
          {{ change.newValue }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  config: Object,
});
const emit = defineEmits(["verified", "error"]);
const verifyAndProceed = async () => {
  try {
    emit("verified");
  } catch (error: any) {
    emit("error", error.message);
  }
};

defineExpose({
  verifyAndProceed,
});
</script>

<style></style>
