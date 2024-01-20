<template>
    <button class="btn rounded-md text-white font-semibold grid place-content-center"
        :class="['btn-' + computedStyling, 'btn-' + computedSize]" :disabled="disabled ? true : false">
        <slot></slot>
    </button>
</template>
  
<script setup lang="ts">
const props = defineProps({
    styling: {
        type: String,
        default: 'primary',
    },
    size: {
        type: String,
        default: 'md',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const allowedStylings = ['primary', 'danger', 'light', 'dark', 'success', 'disabled'];
const allowedSizes = ['xs', 'sm', 'md', 'lg'];

const computedStyling = computed(() => {
    if (props.disabled) {
        return 'disabled';
    }
    return allowedStylings.includes(props.styling) ? props.styling : 'primary';
});

const computedSize = computed(() => {
    return allowedSizes.includes(props.size) ? props.size : 'md';
});
</script>
  

<style lang="scss">
.btn {
    padding-top: clamp(0.5em, 0.6vw, 1em);
    padding-right: clamp(1.25em, 1.75vw, 2em);
    padding-bottom: clamp(0.5em, 0.6vw, 1em);
    padding-left: clamp(1.25em, 1.75vw, 2em);
    @apply transition-all duration-75 font-medium;
}

.btn-xs {
    font-size: clamp(0.75rem, 0.7vw, 1.5rem);

    padding-top: clamp(0.5em, 0.6vw, 1.5em);
    padding-right: clamp(1.75em, 1.25vw, 2.5em);
    padding-bottom: clamp(0.5em, 0.6vw, 1.5em);
    padding-left: clamp(1.75em, 1.25vw, 2.5em);
}

.btn-sm {
    font-size: clamp(0.75rem, 0.8vw, 1.5rem);
}

.btn-md {
    font-size: clamp(0.8rem, 0.7vw, 2rem) !important;
}

.btn-lg {
    font-size: clamp(0.85rem, 1vw, 2.5rem) !important;
}

.btn-primary {
    @apply bg-gradient-to-r from-primary-500 via-primary-500 to-85% to-secondary-300;
    @apply bg-[length:150%_150%] bg-[0px_0px];
}

.btn-primary:hover {
    //@apply bg-[30%_30%];
    @apply saturate-150 shadow-md shadow-gray-900/20;
}

.btn-danger {
    @apply bg-red-500 hover:bg-red-600
}

.btn-disabled {
    @apply bg-gray-200 text-gray-400;
}

.btn-light {
    @apply border border-gray-200 text-gray-800 bg-white hover:bg-gray-200
}

.btn-dark {
    @apply border border-gray-500 text-gray-100 bg-gray-700 hover:bg-gray-800
}

.btn-success {
    @apply bg-green-600 hover:bg-green-700;
}
</style>