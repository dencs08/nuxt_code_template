<template>
  <Dialog
    :visible="visible"
    :modal="true"
    :closable="false"
    :header="config?.header || 'Confirmation'"
    :draggable="false"
    :resizable="false"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    :pt="{ root: { class: 'xs:w-[35rem]' } }"
  >
    <template #container>
      <div
        class="flex flex-col w-full bg-surface-0 dark:bg-surface-700 rounded-md border-surface-200 dark:border-surface-700 relative"
      >
        <div class="shadow">
          <div class="px-5 py-7">
            <div>
              <div class="flex items-center gap-4 mb-5">
                <div
                  class="grid place-content-center bg-primary-500/20 dark:bg-surface-600 p-3 rounded-full w-10 h-10"
                >
                  <Button
                    :icon="config?.icon || 'pi pi-exclamation-triangle'"
                    :severity="config?.severity || 'contrast'"
                    class="text-4xl"
                    rounded
                    outlined
                  ></Button>
                </div>
                <span class="font-medium">{{
                  config?.header || "Confirmation"
                }}</span>
              </div>
            </div>
            <div>
              <p
                :class="config?.component ? 'mb-2.5' : 'm-0'"
                v-if="config.showMessage"
              >
                {{ config?.message || "Are you sure you want to proceed?" }}
              </p>
              <component
                v-if="config.component"
                :is="config.component"
                v-bind="config.componentProps"
                @verified="handleVerified"
                @error="handleError"
                ref="customComponentRef"
                :config="config"
              />
            </div>
          </div>
        </div>
        <div
          class="flex items-center justify-end gap-2 p-4 border-t bg-surface-50/30 dark:bg-surface-900/35 border-surface-100 dark:border-surface-600 rounded-b-md"
        >
          <Button
            :label="config?.rejectLabel || 'No'"
            :severity="config?.rejectSeverity || 'secondary'"
            outlined
            icon="pi pi-times"
            class="bg-white/75 dark:bg-surface-600/75"
            @click="handleReject"
            :disabled="isLoading"
          />
          <Button
            :label="config?.acceptLabel || 'Yes'"
            :severity="config?.acceptSeverity || config?.severity || 'contrast'"
            :icon="isLoading ? 'pi pi-spinner pi-spin' : 'pi pi-check'"
            @click="handleConfirm"
            autofocus
            :loading="isLoading"
          />
        </div>
      </div>

      <div
        v-if="isLoading"
        class="absolute inset-0 bg-surface-0/70 dark:bg-surface-900/70 flex items-center justify-center rounded-md z-10 transition duration-300"
      >
        <ProgressSpinner class="w-16 h-16" />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
const props = defineProps({
  visible: Boolean,
  config: Object,
  isLoading: Boolean,
});

const emit = defineEmits(["update:visible", "confirm", "reject", "error"]);

const customComponentRef = ref(null);

const handleConfirm = () => {
  if (
    customComponentRef.value &&
    "verifyAndProceed" in customComponentRef.value
  ) {
    customComponentRef.value.verifyAndProceed();
  } else {
    emit("confirm");
  }
};

const handleVerified = (value: any) => {
  emit("confirm", value);
};

const handleError = (errorMessage: string) => {
  emit("error", errorMessage);
};

const handleReject = () => {
  emit("reject");
};
</script>
