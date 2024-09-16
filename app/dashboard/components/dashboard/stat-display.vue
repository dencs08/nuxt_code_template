<template>
  <Card class="relative custom-card overflow-hidden">
    <template #content>
      <div class="flex flex-row justify-between h-full">
        <div>
          <h3 class="text-lg font-bold">{{ title }}</h3>
          <div class="text-3xl font-bold">{{ value }}</div>
        </div>
        <div class="flex flex-col justify-between h-full">
          <div class="flex flex-row gap-1 items-center">
            <p :class="changeClass">{{ formattedChange }}</p>
          </div>
          <div>
            <!-- <Select
              v-model="selectedPeriod"
              @change="$emit('period-change', selectedPeriod)"
            >
              <option value="1d">1 Day</option>
              <option value="1w">1 Week</option>
              <option value="1m">1 Month</option>
            </Select> -->
          </div>
        </div>
      </div>
      <div class="absolute pointer-events-none select-none" :class="iconPos">
        <Icon
          :class="[changeClass]"
          :name="iconName"
          class="h-64 w-auto opacity-15"
        ></Icon>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  title: String,
  value: [Number, String],
  change: Number,
  period: {
    type: String,
    default: "1d",
  },
});

const emit = defineEmits(["period-change"]);

const selectedPeriod = ref(props.period);

const formattedChange = computed(() => {
  const prefix = props.change > 0 ? "+" : "";
  return `${prefix}${props.change.toFixed(2)}%`;
});

const changeClass = computed(() => {
  return props.change > 0 ? "text-green-500" : "text-red-500";
});

const iconName = computed(() => {
  return props.change > 0 ? "ic:round-trending-up" : "ic:round-trending-down";
});

const iconPos = computed(() => {
  return props.change > 0 ? "-top-12 right-0" : "-top-24 right-0";
});
</script>
