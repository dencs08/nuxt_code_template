<template>
  <div class="relative flex flex-col h-full w-full">
    <Chart
      :data="chartData"
      :options="chartOptions"
      :key="chartKey"
      :type="props.type"
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
          <div class="flex flex-row items-center justify-between">
            <div class="flex gap-1.5 items-center">
              <Icon name="ic:twotone-circle" class="h-2 w-auto"></Icon>
              <p>{{ tooltipData.label }}</p>
            </div>
            <div class="flex flex-row gap-1">
              <p>
                {{ tooltipData.value }}
              </p>
            </div>
          </div>
        </slot>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import Chart from "primevue/chart";
const { isDarkMode } = useDarkMode();
import { generatedColors } from "~~/app/core/assets/primevue/generated-colors";

const chartRef = ref(null);
const tooltipData = ref({ value: "", label: "" });

const props = defineProps({
  type: {
    type: String,
    required: true,
    default: "bar",
  },
  title: String,
  data: Array,
  xKey: String,
  yKey: String,
});

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

const chartData = computed(() => ({
  labels: props.data.map((item: any) => item[props.xKey]),
  datasets: [
    {
      label: props.title,
      data: props.data.map((item: any) => item[props.yKey]),
      backgroundColor: colors.value.bar,
      borderRadius: 12,
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
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
const showTooltip = ref(false);
const tooltipContent = ref("");
const tooltipStyle = ref({});

const onChartHover = (event: MouseEvent) => {
  const chart = chartRef.value.chart;
  const activeElements = chart.getElementsAtEventForMode(
    event,
    "nearest",
    { intersect: true },
    false
  );

  if (activeElements.length > 0) {
    const { datasetIndex, index } = activeElements[0];
    updateTooltip(event, datasetIndex, index);
  } else {
    hideTooltip();
  }
};

const updateTooltip = (
  event: MouseEvent,
  datasetIndex: number,
  index: number
) => {
  const chart = chartRef.value.chart;
  const dataset = chart.data.datasets[datasetIndex];
  const value = dataset.data[index];
  const label = chart.data.labels[index];
  tooltipData.value = { value, label };

  tooltipContent.value = `${value} (${label})`;

  const barElement = chart.getDatasetMeta(datasetIndex).data[index];
  const rect = barElement.getCenterPoint();

  // Calculate the position relative to the chart canvas
  const canvasRect = chart.canvas.getBoundingClientRect();
  const xPosition = rect.x;
  const yPosition = rect.y * 0.9;

  // Determine if the tooltip should be on the left or right side
  const chartWidth = chart.width;
  const tooltipWidth = 200; // Estimate tooltip width, adjust as needed
  const padding = 10;

  let left, transform;
  if (xPosition + tooltipWidth + padding > chartWidth) {
    // Position on the left side of the bar if too close to the right edge
    left = `${xPosition - padding}px`;
    transform = "translateX(-115%)";
  } else {
    // Position on the right side of the bar
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

<style scoped></style>
