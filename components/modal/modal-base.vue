<template>
    <teleport to="body">
        <Transition name="fade">
            <div v-if="isRevealed"
                 class="fixed h-[101vh] w-screen top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 grid place-content-center bg-gray-900/50 z-[10000]"
                 @click.self="emit('close')"> <!-- add the @click.self modifier here -->
                <div :class="{ 'max-w-sm': size === 'sm', 'max-w-md': size === 'md', 'max-w-lg': size === 'lg' }" class="px-4">
                    <div class="bg-white rounded-t-lg">
                        <slot></slot>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 flex flex-col sm:flex-row-reverse sm:px-6 gap-2 rounded-b-lg">
                        <slot name="actions"></slot>
                    </div>
                </div>
            </div>
        </Transition>
    </teleport>
</template>

<script setup>
const props = defineProps({
    isRevealed: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: 'md',
    },
})

const emit = defineEmits(['close', 'confirm'])
</script>
