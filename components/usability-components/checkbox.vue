<template>
    <div class="flex items-center gap-2">
        <input :id="name" :name="name" :type="type" v-model="value"
            class="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" :checked="value" />
        <label :for="name" class="block text-sm text-gray-600">{{ label }}</label>
    </div>
</template>
<script setup lang="ts">
const props = defineProps({
    label: String,
    name: String,
    type: {
        type: String,
        default: 'checkbox',
    },
    required: Boolean,
    modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue']);

const value = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});
</script>
<style lang="">
    
</style>