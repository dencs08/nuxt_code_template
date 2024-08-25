<template>
  <div>
    <button
      v-if="type === 'button'"
      @click="darkModeStore.toggleDarkMode()"
      class="grid place-content-center"
    >
      <Icon
        v-auto-animate
        :name="
          darkModeStore.isDarkMode
            ? 'ic:outline-dark-mode'
            : 'ic:outline-light-mode'
        "
        class="text-lg"
      />
    </button>
    <ToggleSwitch
      v-else-if="type === 'switch'"
      :model-value="darkModeStore.isDarkMode"
      @update:model-value="darkModeStore.toggleDarkMode()"
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

const darkModeStore = useDarkModeStore();
</script>
