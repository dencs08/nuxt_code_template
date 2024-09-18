<template>
  <div class="relative flex flex-col h-full w-full">
    <div class="flex flex-row justify-between items-center mb-2">
      <h2 class="text-base font-bold">{{ title }}</h2>
      <div class="flex flex-row gap-4">
        <ul class="flex space-x-4">
          <li
            v-for="(dataset, index) in chartData.datasets"
            :key="index"
            class="flex items-center"
          >
            <span
              :style="{ backgroundColor: dataset.backgroundColor }"
              class="rounded-full w-3 h-3 inline-block mr-2"
            ></span>
            <span class="text-sm text-surface-500 dark:text-surface-300">
              {{ dataset.label }}
            </span>
          </li>
        </ul>
      </div>
    </div>
    <Chart
      :data="chartData"
      :options="chartOptions"
      :key="chartKey"
      :type="type"
      class="flex flex-col h-full w-full min-h-[50vh]"
      @mousemove="onChartHover"
      @mouseleave="hideTooltip"
      ref="chartRef"
    />
    <transition
      enter-active-class="transition-opacity duration-300 ease-in-out"
      leave-active-class="transition-opacity duration-300 ease-in-out"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showTooltip"
        class="absolute min-w-[140px] px-2.5 py-2 shadow-xl border border-surface-100 dark:border-surface-500 rounded text-sm pointer-events-none z-[100] whitespace-nowrap"
        :style="tooltipStyle"
      >
        <slot name="tooltip" v-bind="tooltipData">
          <div class="flex flex-col">
            <div
              v-for="(item, idx) in tooltipData.data"
              :key="idx"
              class="flex flex-row items-center justify-between gap-2"
            >
              <div class="flex gap-1.5 items-center">
                <span
                  :style="{ backgroundColor: item.backgroundColor }"
                  class="w-2 h-2 inline-block mr-1 rounded-full"
                ></span>
                <p class="font-normal text-surface-600 dark:text-surface-200">
                  {{ item.datasetLabel }}
                </p>
              </div>
              <div class="flex flex-row gap-1">
                <p class="font-medium">{{ item.value }}</p>
              </div>
            </div>
          </div>
        </slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import Chart from "primevue/chart";
import { generatedColors } from "~~/app/core/assets/primevue/generated-colors";

const chartRef = ref(null);
const tooltipData = ref({ data: [] });
const showTooltip = ref(false);
const tooltipStyle = ref({});

const props = defineProps({
  type: {
    type: String,
    required: true,
    default: "bar",
  },
  title: String,
  datasets: {
    type: Array,
    required: true,
  },
  labels: {
    type: Array,
    required: true,
  },
});

const { isDarkMode } = useDarkMode();

const colors = computed(() => {
  if (isDarkMode.value) {
    return {
      bar: generatedColors["my.surface"]["500"],
      axis: generatedColors["my.surface"]["350"],
      grid: generatedColors["my.surface"]["750"],
      tooltip: {
        background: generatedColors["my.surface"]["700"],
        text: generatedColors["my.surface"]["50"],
      },
    };
  }
  return {
    bar: generatedColors["my.surface"]["300"],
    axis: generatedColors["my.surface"]["500"],
    grid: generatedColors["my.surface"]["50"],
    tooltip: {
      background: "#ffffff",
      text: generatedColors["my.surface"]["700"],
    },
  };
});

const defaultColors = ["#FF6384", "#36A2EB", "#FFCE56", "#AA65CC", "#62D4B3"];

function getColor(index: number) {
  return defaultColors[index % defaultColors.length];
}

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map((dataset: any, index: number) => ({
    ...dataset,
    backgroundColor: dataset.backgroundColor || getColor(index),
    borderRadius: 8,
  })),
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  hover: {
    mode: "index",
    intersect: false,
  },
  scales: {
    x: {
      stacked: true, // Enable stacking for x-axis
      grid: {
        display: false,
        color: colors.value.grid,
      },
      ticks: {
        color: colors.value.axis,
        font: {
          size: 16,
          weight: "light",
        },
      },
    },
    y: {
      stacked: true, // Enable stacking for y-axis
      grid: {
        color: colors.value.grid,
      },
      ticks: {
        color: colors.value.axis,
        font: {
          size: 16,
          weight: "light",
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
}));

const chartKey = ref(0);
watch(isDarkMode, () => {
  chartKey.value++;
});

// Custom tooltip logic
const onChartHover = (event: MouseEvent) => {
  const chart = chartRef.value.chart;
  const activeElements = chart.getElementsAtEventForMode(
    event,
    "index",
    { intersect: false },
    false
  );

  if (activeElements.length > 0) {
    const { index } = activeElements[0];
    updateTooltip(event, index);
  } else {
    hideTooltip();
  }
};

const updateTooltip = (event: MouseEvent, index: number) => {
  const chart = chartRef.value.chart;
  const datasets = chart.data.datasets;

  // Reverse the datasets to match the rendering order
  const dataForIndex = [...datasets].reverse().map((dataset: any) => ({
    datasetLabel: dataset.label,
    value: dataset.data[index],
    backgroundColor: dataset.backgroundColor,
  }));

  // Compute the sum of the values
  const sumOfValues = dataForIndex.reduce(
    (sum, item) => sum + (Number(item.value) || 0),
    0
  );

  // If the sum is zero, hide the tooltip and exit the function
  if (sumOfValues === 0) {
    showTooltip.value = false;
    return;
  }

  tooltipData.value = { data: dataForIndex };

  // Use the element of the first dataset for positioning
  const barElement = chart.getDatasetMeta(0).data[index];
  const rect = barElement.getCenterPoint();

  const xPosition = rect.x;
  const yPosition = rect.y * 0.8;

  const chartWidth = chart.width;
  const tooltipWidth = 200;
  const padding = 10;

  let left, transform;
  if (xPosition + tooltipWidth + padding > chartWidth) {
    left = `${xPosition - padding}px`;
    transform = "translateX(-115%)";
  } else {
    left = `${xPosition + padding}px`;
    transform = "translateX(15%)";
  }

  tooltipStyle.value = {
    left,
    top: `${yPosition}px`,
    transform,
    backgroundColor: colors.value.tooltip.background,
    color: colors.value.tooltip.text,
  };
  showTooltip.value = true;
};

const hideTooltip = () => {
  showTooltip.value = false;
};
</script>
