<template>
  <Card class="relative custom-card overflow-hidden">
    <template #content>
      <div class="flex flex-row justify-between h-full">
        <div>
          <h3 class="text-lg font-bold">{{ title }}</h3>
          <div class="text-3xl font-bold">
            <Skeleton v-if="loading" width="100%" height="36px" />
            <span v-else>{{ value }}</span>
          </div>
        </div>
        <div class="flex flex-col justify-between h-full">
          <div class="flex flex-row gap-1 items-center">
            <p :class="changeClass" class="text-lg font-bold">
              <Skeleton v-if="loading" width="50px" height="20px" />
              <span v-else>{{ formattedChange }}</span>
            </p>
            <span class="text-xs font-light text-muted-color">
              ({{ selectedPeriod }})
            </span>
          </div>
          <div>
            <!-- Additional content can go here -->
          </div>
        </div>
      </div>
      <div class="absolute pointer-events-none select-none" :class="iconPos">
        <Icon
          v-if="!loading"
          :class="[changeClass]"
          :name="iconName"
          class="h-64 w-auto opacity-15"
        ></Icon>
      </div>
    </template>
  </Card>
</template>

<script setup>
const props = defineProps({
  title: String,
  value: [Number, String],
  change: Number,
  period: {
    type: String,
    default: "1d",
  },
  loading: Boolean,
});

const emit = defineEmits(["period-change"]);

const selectedPeriod = ref(props.period);

const formattedChange = computed(() => {
  const prefix = props.change > 0 ? "+" : "";
  return `${prefix}${props.change.toFixed(2)}%`;
});

const changeClass = computed(() => {
  if (props.change > 0) {
    return "text-green-500";
  } else if (props.change < 0) {
    return "text-red-500";
  } else {
    return "text-gray-500";
  }
});

const iconName = computed(() => {
  if (props.change > 0) {
    return "ic:round-trending-up";
  } else if (props.change < 0) {
    return "ic:round-trending-down";
  } else {
    return "ic:round-trending-flat";
  }
});

const iconPos = computed(() => {
  if (props.change > 0) {
    return "-top-12 right-0";
  } else if (props.change < 0) {
    return "-top-24 right-0";
  } else {
    return "-top-8 right-0";
  }
});
</script>
