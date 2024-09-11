<template>
  <div>
    <button
      v-if="type === 'button'"
      @click="handleToggle"
      class="grid place-content-center"
      :class="[
        adjustColor ? 'text-surface-800 dark:text-surface-0' : 'text-surface-0',
      ]"
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
  adjustColor: {
    type: Boolean,
    default: true,
  },
});

const { isDarkMode, toggleDarkMode, currentLayout } = useDarkMode();

const handleToggle = () => {
  toggleDarkMode();
};
</script>
