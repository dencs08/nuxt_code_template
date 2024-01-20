<template>
    <ModalWrapper @confirm="confirmAction" @cancel="closeAction" :modalProps="{ isRevealed }">
        <p>{{ message }}</p>
    </ModalWrapper>
</template>

<script setup>
const props = defineProps({
    isRevealed: {
        type: Boolean,
        default: false,
    },
    message: {
        type: String,
        default: 'Are you sure?'
    },
})

const emit = defineEmits(['cancel', 'confirm'])

const confirmAction = () => {
    emit('confirm')
}

const closeAction = () => {
    emit('cancel')
}

</script>
