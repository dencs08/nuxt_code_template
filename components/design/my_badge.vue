<template>
    <span v-if="loading">
        <AnimatedPlaceholder class="w-12 h-6 rounded-full" />
    </span>
    <span v-else class="inline-flex items-center rounded-full px-3.5 py-1 text-xs font-medium ring-1 ring-inset text-white"
        :class="badgeClasses">
        <slot></slot>
    </span>
</template>
<script setup lang="ts">
const props = defineProps({
    type: {
        type: String,
        default: 'primary',
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

const allowedTypes = [
    'primary', 'secondary', 'success', 'danger', 'important', 'light',
];

const badgeClasses = computed(() => {
    const type = allowedTypes.includes(props.type) ? props.type : 'gray';
    return `badge-${type}`;
});
</script>

<style scoped>
.badge-primary {
    @apply bg-primary-400 ring-primary-600/10;
}

.badge-secondary {
    @apply bg-secondary-700 ring-secondary-600/10;
}

.badge-danger {
    @apply bg-red-400 ring-red-600/10;
}

.badge-success {
    @apply bg-green-400 ring-green-600/10;
}

.badge-important {
    @apply bg-yellow-500 ring-yellow-600/10;
}

.badge-light {
    @apply bg-gray-100 text-gray-600 ring-1 ring-gray-300;
}
</style>