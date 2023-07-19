<template>
    <teleport to="body">
        <Transition name="fade">
            <div v-if="isRevealed"
                class="fixed h-[101vh] w-screen top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 grid place-content-center bg-gray-900/50 z-[10000]">
                <div class="max-w-2xl px-4">

                    <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 rounded-t-lg">
                        <div class="sm:flex sm:items-start">
                            <div
                                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
                                <Icon name="ic:round-error-outline" class="w-auto h-4/5 text-gray-400" />
                            </div>
                            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h3 class="text-base font-semibold leading-6 text-gray-900">
                                    {{ question }}
                                </h3>
                                <div class="mt-2">
                                    <p class="text-sm text-gray-500">Be careful - this action <span
                                            class="font-bold">cannot</span> be undone</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 px-4 py-3 flex flex-col sm:flex-row-reverse sm:px-6 gap-2 rounded-b-lg">
                        <Button styling="success" size="xs" @click="confirm" class="h-9 w-full sm:w-auto">Yes</Button>
                        <Button styling="danger" size="xs" @click="cancel" class="h-9 w-full sm:w-auto">Cancel</Button>
                    </div>
                </div>
            </div>
        </Transition>
    </teleport>
</template>

<script setup>
const props = defineProps({
    question: {
        type: String,
        default: 'Confirm?',
    },
})

const {
    isRevealed,
    reveal,
    confirm,
    cancel,
    onReveal,
    onConfirm,
    onCancel,
} = useConfirmDialog()

</script>