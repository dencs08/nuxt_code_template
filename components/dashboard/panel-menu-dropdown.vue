<template>
    <PanelMenu :model="filteredNavigation" class="dashboard-custom-panel" multiple>
        <template #item="{ item }">
            <nuxt-link :to="item.route" :href="item.href" v-ripple
                class="group flex items-center cursor-pointer text-surface-700 dark:text-surface-0/80 hover:bg-surface-400/15 px-2 py-1 rounded"
                @click="toggleDropdown(item)">
                <span :class="item.icon" />
                <span class="ml-2 text-sm">{{ item.label }}</span>
                <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
                <span v-if="item.shortcut"
                    class="ml-auto border border-surface-200 dark:border-surface-700 rounded bg-surface-100 dark:bg-surface-700 text-xs p-1">{{
        item.shortcut }}</span>
                <span v-if="item.items"
                    class="pi pi-angle-right text-primary-500 dark:text-primary-400 ml-auto transform transition-transform group-hover:rotate-90"
                    :class="{ 'rotate-90': dropdowns[item.label] }" />
            </nuxt-link>
        </template>
    </PanelMenu>
</template>

<script setup>
const props = defineProps(['navigation']);

const dropdowns = reactive({});
const toggleDropdown = (item) => {
    if (!item.items || item.items.length === 0) return; // Ignore items without sub-items
    dropdowns[item.label] = !dropdowns[item.label];
};

const filteredNavigation = computed(() => {
    return props.navigation.filter(item => (item.route) || (item.items && item.items.length > 0));
});
</script>