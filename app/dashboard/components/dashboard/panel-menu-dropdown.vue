<template>
  <PanelMenu
    :model="filteredNavigation"
    multiple
    :pt="{
      panel: ['!border-0 !m-0 !p-0'],
    }"
  >
    <template #item="{ item }">
      <nuxt-link
        :to="item.route"
        :href="item.href"
        v-ripple
        class="group flex items-center cursor-pointer text-surface-700 dark:text-surface-0 px-2 py-1 rounded transition duration-500"
        @click="toggleDropdown(item)"
        exact-active-class="bg-surface-500/10"
      >
        <span
          :class="item.icon"
          class="text-surface-600/75 dark:text-surface-0/75"
        />
        <span class="ml-2 text-sm text-surface-600/75 dark:text-surface-0/75">{{
          item.label
        }}</span>
        <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
        <span
          v-if="item.shortcut"
          class="ml-auto border border-surface-200 dark:border-surface-700 rounded bg-surface-100 dark:bg-surface-700 text-xs p-1"
          >{{ item.shortcut }}</span
        >
        <span
          v-if="item.items"
          class="pi pi-angle-right text-surface-600/50 dark:text-surface-200 ml-auto transform transition-transform group-hover:rotate-90 duration-300 ease-in-out"
          :class="{ 'rotate-90': dropdowns[item.label] }"
        />
      </nuxt-link>
    </template>
  </PanelMenu>
</template>

<script setup>
const props = defineProps(["navigation"]);

const dropdowns = reactive({});
const toggleDropdown = (item) => {
  if (!item.items || item.items.length === 0) return; // Ignore items without sub-items
  dropdowns[item.label] = !dropdowns[item.label];
};

const filteredNavigation = computed(() => {
  return props.navigation.filter(
    (item) => item.route || (item.items && item.items.length > 0)
  );
});
</script>
