<template>
  <div>
    <button
      v-if="type === 'button'"
      @click="toggle()"
      class="grid place-content-center"
    >
      <Icon
        v-auto-animate
        :name="isDark ? 'ic:outline-dark-mode' : 'ic:outline-light-mode'"
        class="text-lg"
      />
    </button>
    <ToggleSwitch v-else-if="type === 'switch'" v-model="isDark" />
  </div>
</template>

<script setup lang="ts">
const isDark = useDark();
const test = ref();
const toggle = useToggle(isDark);

const props = defineProps({
  type: {
    type: String,
    default: "button",
  },
});
</script>
