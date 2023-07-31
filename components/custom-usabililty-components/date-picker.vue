<template>
    <VueDatePicker v-model="date" :min-date="minDate" placeholder="Select Date" :range="range"></VueDatePicker>
</template>

<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const props = defineProps({
    daysAhead: {
        type: Number,
    },
    range: {
        type: Boolean,
        default: false
    }
})

const date = ref();
const today = new Date();
const minDate = computed(() => {
    if (!(props.daysAhead >= 0)) return;
    // console.log(props.daysAhead);
    const result = new Date(today);
    result.setDate(result.getDate() + props.daysAhead);
    return result;
});

</script>

<style>
.dp__pointer {
    @apply rounded-lg py-2 border-gray-300;
}
</style>
