<template>
    <ModalBase v-bind="modalProps" @close="closeModal" :size="size">
        <slot></slot>

        <template #actions>
            <slot name="actions">
                <Button styling="success" size="xs" @click="confirmModal">Confirm</Button>
                <Button styling="danger" size="xs" @click="closeModal">Cancel</Button>
            </slot>
        </template>
    </ModalBase>
</template>

<script setup>
const props = defineProps({
    modalProps: {
        type: Object,
        default: () => ({}),
    },
    size: {
        type: String,
        default: "medium"
    }
})

const emit = defineEmits(['confirm', 'close'])

const closeModal = () => {
    emit('close')
}

const confirmModal = () => {
    emit('confirm')
}
</script>
