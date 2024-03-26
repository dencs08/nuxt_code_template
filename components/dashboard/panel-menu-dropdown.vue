<template>
    <PanelMenu :model="filteredNavigation" class="dashboard-custom-panel" multiple>
        <template #item="{ item }">
            <nuxt-link v-if="item.route" :to="item.route" v-ripple
                class="group flex items-center cursor-pointer text-surface-700 dark:text-surface-0/80 hover:bg-surface-400/15 px-3 py-2 my-1 rounded"
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
            <a v-else v-ripple
                class="group flex items-center cursor-pointer text-surface-700 dark:text-surface-0/80 hover:bg-surface-400/15 px-3 py-2 rounded"
                :href="item.url" :target="item.target" @click="toggleDropdown(item)">
                <span :class="item.icon" />
                <span class="ml-2 text-sm">{{ item.label }}</span>
                <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
                <span v-if="item.shortcut"
                    class="ml-auto border border-surface-200 dark:border-surface-700 rounded bg-surface-100 dark:bg-surface-700 text-xs p-1">{{
        item.shortcut }}</span>
                <span v-if="item.items"
                    class="pi pi-angle-right text-primary-500 dark:text-primary-400 ml-auto transform transition-transform group-hover:rotate-90"
                    :class="{ 'rotate-90': dropdowns[item.label] }" />
            </a>
            <!-- <Divider v-if="item !== navigation[navigation.length - 1]"
                :pt="{ root: { class: 'flex relative my-1.5 mx-0 py-0 px-5 w-full before:block before:absolute before:left-0 before:top-1/2 before:w-full before:border-solid before:border-t before:border-surface-200/40 before:dark:border-surface-700/75' } }" /> -->
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

<style scoped>
.router-link-active,
.router-link-exact-active {
    @apply font-bold text-primary-500 dark:text-primary-400 bg-surface-500/10;
}
</style>
