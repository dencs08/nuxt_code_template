<template>
    <div>
        <dl class="flex flex-col lg:flex-row gap-4">
            <Card class="relative overflow-hidden w-full shadow">
                <dt class="flex items-center gap-2.5">
                    <div v-if="icon" class="rounded-md bg-primary-500 p-3">
                        <Icon :name="icon" class="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div class="w-full">
                        <p class="truncate text-sm font-medium text-gray-500">{{ label }}</p>
                        <p v-if="loading">
                            <AnimatedPlaceholder class="min-w-full h-auto rounded-md" />
                        </p>
                        <p v-else class="text-xl font-semibold text-gray-900">{{ value }}</p>
                    </div>
                </dt>
            </Card>
        </dl>
    </div>
</template>
  
<script setup>
const props = defineProps({
    label: String,
    icon: String,
    value: Number,
    href: String,

    loading: {
        type: Boolean,
        default: false,
    }
})
</script>