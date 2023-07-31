<template>
    <div class="relative">
        <AnimatedPlaceholder v-if="loading" class="h-10 w-full rounded" />
        <input v-if="!loading" :type="type" :name="name" :id="name" v-model="value"
            :class="`block rounded-lg px-3.5 pb-0.5 pt-4 w-full text-md ${hasError ? 'text-red-500 border-red-500' : ''} ${borderStyle == 'full' ? 'border' : 'border-b'} text-gray-900 border-gray-300 bg-white appearance-none focus:outline-none focus:ring-0 focus:border-primary-500 peer transition-colors duration-300`"
            placeholder=" " :aria-describedby="name + '-optional'" :required="required" />
        <Icon v-if="icon" :name="icon" class="absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-500" />
        <label :for="name"
            class="absolute text-sm duration-300 text-gray-500 transform truncate -translate-y-3.5 scale-75 top-[0.8rem] z-10 origin-[0] left-3.5 peer-focus:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 pointer-events-none">
            {{ hasError ? props.hint : label }} <span v-if="required && !hasError">*</span>
        </label>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    label: String,
    type: String,
    name: String,
    required: Boolean,
    modelValue: String,
    icon: String,
    borderStyle: {
        type: String,
        default: 'full',
    },
    error: {
        type: Boolean,
        default: false,
    },
    hint: {
        type: String,
        default: 'Error: Input is not valid.',
    },
    loading: {
        type: Boolean,
        default: false,
    }
});

const emit = defineEmits(['update:modelValue']);
const value = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});
const hasError = ref(props.error);
</script>
