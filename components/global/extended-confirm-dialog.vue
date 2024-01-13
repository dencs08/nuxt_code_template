<template>
    <ConfirmDialog :group="group" :pt="pt">
        <template #container="{ message, acceptCallback, rejectCallback }">
            <div
                class="flex flex-col w-full gap-3 border-b bg-surface-0 dark:bg-surface-700 rounded-md border-surface-200 dark:border-surface-700">
                <div class="p-5">
                    <div>
                        <div class="flex items-center gap-4 mb-5">
                            <div
                                class="grid place-content-center bg-primary-500/20 dark:bg-surface-600 p-3 rounded-full w-10 h-10">
                                <i :class="message.icon, message.iconClass" class="text-2xl"></i>
                            </div>
                            <span class="font-medium text-md">{{ message.header }}</span>
                        </div>
                    </div>
                    <div>
                        <slot name="body" :message="message"></slot>
                    </div>
                </div>
                <div
                    class="flex items-center justify-end gap-2 p-4 border-t bg-surface-50/40 dark:bg-surface-900/35 border-surface-100 dark:border-surface-600">
                    <Button label="Confirm" @click="acceptCallback" :class="message.acceptClass"></Button>
                    <Button label="Cancel" outlined severity="secondary" @click="rejectCallback"></Button>
                </div>
            </div>
        </template>
    </ConfirmDialog>
</template>
  
<script setup>
const group = ref('');
const pt = ref({});
</script>