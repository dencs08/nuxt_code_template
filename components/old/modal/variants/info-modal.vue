<template>
    <ModalWrapper @close="closeAction" :modalProps="{ isRevealed }">
        <p>{{ infoMessage }}</p>
    </ModalWrapper>
</template>
  
<script setup>
const props = defineProps({
    isRevealed: {
        type: Boolean,
        default: false,
    },
    infoMessage: {
        type: String,
        default: 'Info'
    },
})

const emit = defineEmits(['close'])

const closeAction = () => {
    emit('close')
}
</script>
  