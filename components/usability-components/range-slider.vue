<template>
    <div class="relative" @mouseenter="showTooltip = true" @mouseleave="hideTooltip">
        <div ref="tooltip" :style="{ left: tooltipPosition, opacity: showTooltip ? 1 : 0 }"
            class="tooltip absolute -translate-x-1/2 -translate-y-7 bg-gray-500/75 px-2 py-1 rounded text-white text-sm no-wrap transition-opacity duration-300">
            {{ currentValue }}
        </div>
        <div ref="sliderContainer">
            <input class="bg-primary-500 text-primary-500" ref="rangeInput" type="range" :min="min" :max="max" :step="step"
                v-model="currentValue" @input="handleInput" @blur="hideTooltip" />
        </div>
        <div class="flex justify-between mt-2">
            <div class="bg-white px-3 py-1 rounded-md shadow-md">{{ prefix }}{{ min }}{{ suffix }}</div>
            <div class="bg-white px-3 py-1 rounded-md shadow-md">{{ prefix }}{{ max }}{{ suffix }}</div>
        </div>

    </div>
</template>

<script setup>

const props = defineProps({
    min: {
        type: Number,
        default: 0,
    },
    max: {
        type: Number,
        default: 100,
    },
    step: {
        type: Number,
        default: 1,
    },
    value: {
        type: Number,
        default: 50,
    },
    label: {
        type: String,
        default: '',
    },
    suffix: {
        type: String,
        default: '',
    },
    prefix: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(["update:modelValue"]);

const showTooltip = ref(false);
const currentValue = ref(props.value);

let rangeWidth = 0;
let thumbWidth = 16;

const rangeInput = ref(null);
const tooltip = ref(null);
const sliderContainer = ref(null);

const tooltipPosition = ref('');

onBeforeUpdate(() => {
    rangeWidth = sliderContainer.value.clientWidth;
    updateTooltipPosition();
});

onMounted(async () => {
    rangeWidth = sliderContainer.value.clientWidth;

    showTooltip.value = true;
    await nextTick();
    showTooltip.value = false;
});

watchEffect(() => {
    currentValue.value = props.value;
});

function handleInput(event) {
    currentValue.value = Number(event.target.value);
    emit("update:modelValue", currentValue.value);
    showTooltip.value = true;
}

function hideTooltip() {
    showTooltip.value = false;
}

function updateTooltipPosition() {
    const ratio = (currentValue.value - props.min) / (props.max - props.min);
    const positionPercentage =
        ratio * (100 - (thumbWidth / rangeWidth) * 100) + (thumbWidth / rangeWidth) * 100 / 2;
    tooltipPosition.value = `${positionPercentage}%`;
}
</script>

  
<style lang="scss" scoped>
input {
    @apply w-full h-1 rounded outline-none border-none bg-primary-900/20;
    touch-action: manipulation;
}

input::-webkit-slider-thumb {
    @apply bg-primary-500 border-2 border-primary-400 h-4 w-4 rounded-full cursor-pointer;
    -webkit-appearance: none;
    touch-action: manipulation;
}

input::-moz-range-thumb {
    @apply bg-primary-500 border-2 border-primary-400 h-4 w-4 rounded-full cursor-pointer;
    -webkit-appearance: none;
    touch-action: manipulation;
}

input::-moz-range-progress {
    @apply bg-primary-500;
}
</style>
  