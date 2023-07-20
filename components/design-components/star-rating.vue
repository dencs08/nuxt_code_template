<template>
    <div class="flex">
        <span v-for="n in 5" :key="n" class="cursor-pointer" @click.stop="setRating(n)">
            <Icon :name="n <= rating ? 'ic:round-star' : 'ic:round-star-outline'" class="h-6 w-6 p-0" />
        </span>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: [Number, String],
        default: 1,
    },
    interactive: {
        type: Boolean,
        default: false,
    }
});

const rating = ref(props.modelValue)

const setRating = (n) => {
    if (!props.interactive) return;
    rating.value = n
    emit('update:modelValue', n)
}

const emit = defineEmits(['update:modelValue'])
</script>
