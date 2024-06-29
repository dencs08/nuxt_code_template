<template>
    <FloatLabel v-if="float">
        <InputText :id="props.id" v-model="innerValue" />
        <label :for="props.id">{{ props.placeholder }}</label>
    </FloatLabel>
    <InputText v-else :id="props.id" v-model="innerValue" :placeholder="props.placeholder" />
</template>

<script setup lang="ts">
const props = defineProps({
    id: {
        type: String,
        default: null
    },
    placeholder: {
        type: String,
        default: null
    },
    float: {
        type: Boolean,
        default: false
    },
    modelValue: {
        type: String,
        default: ''
    },
})

const emit = defineEmits(['update:modelValue']);

// Use a computed property to work directly with `v-model`
const innerValue = ref(props.modelValue);

// Watch for internal changes and emit an update event
watch(innerValue, (newValue) => {
    emit('update:modelValue', newValue);
});

// Also watch for changes from the parent component
watch(() => props.modelValue, (newVal) => {
    if (newVal !== innerValue.value) {
        innerValue.value = newVal;
    }
});

// const hasError = ref(props.error);
</script>
<style lang="">

</style>