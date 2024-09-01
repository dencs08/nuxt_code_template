<template>
  <div>
    <button
      v-if="type === 'button'"
      @click="handleToggle"
      class="grid place-content-center"
    >
      <Icon
        v-auto-animate
        :name="isDarkMode ? 'ic:outline-dark-mode' : 'ic:outline-light-mode'"
        class="text-lg"
      />
    </button>
    <ToggleSwitch
      v-else-if="type === 'switch'"
      :model-value="isDarkMode"
      @update:model-value="handleToggle"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    default: "button",
  },
});

const { isDarkMode, toggleDarkMode, currentLayout } = useDarkMode();

const handleToggle = () => {
  toggleDarkMode();
};
</script>
