<template>
    <div class="flex relative">
        <button type="button" @click="decrement"
            class="box-border border-l border-t border-b border-gray-300 py-2 rounded-l-lg px-4">-</button>
        <label class="absolute top-0 left-12 scale-90 text-sm text-gray-500">{{ label }}</label>
        <input type="number" :value="value" @input="updateValue($event)"
            class="border-box w-full border border-gray-300 pt-4 pb-0 no-spin-buttons" />
        <button type="button" @click="increment"
            class="border-box border-r border-t border-b border-gray-300 py-2 rounded-r-lg px-4">+</button>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    label: String,
    modelValue: {
        type: Number,
        default: 0
    },
    step: {
        type: Number,
        default: 1,
    }
});

let value = ref(props.modelValue);

const emit = defineEmits(['update:modelValue'])
emit('update:modelValue', value.value);

watch(() => props.modelValue, (newValue) => {
    value.value = newValue;
});

const updateValue = ($event: Event) => {
    const target = $event.target as HTMLInputElement | null;
    if (target !== null) {
        value.value = Number(target.value);
        emit('update:modelValue', value.value);
    }
};

const increment = () => {
    const step = calculateStep(value.value);
    value.value += step;
    emit('update:modelValue', value.value);
};

const decrement = () => {
    const step = calculateStep(value.value);
    value.value -= step;
    emit('update:modelValue', value.value);
};

const calculateStep = (value: number) => {
    let step = Math.floor(value / 20);
    step = Math.ceil(step / 10) * 10;
    return Math.max(step, 10);
};
</script>

<style scoped>
.no-spin-buttons::-webkit-inner-spin-button,
.no-spin-buttons::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.no-spin-buttons {
    -moz-appearance: textfield;
}
</style>
