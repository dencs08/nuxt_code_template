<template>
    <PanelMenu :model="dashboardNavigation" class="dashboard-custom-panel" multiple>
        <template #item="{ item }">
            <nuxt-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a v-ripple
                    class="group flex items-center cursor-pointer text-surface-700 dark:text-surface-500/80 px-3 py-2"
                    :href="href" @click="navigate">
                    <span :class="item.icon + ' transform group-hover:scale-x-[-1]'" />
                    <span class="ml-2 text-color text-sm">{{ item.label }}</span>
                </a>
            </nuxt-link>
            <a v-else v-ripple
                class="group flex items-center cursor-pointer text-surface-700 dark:text-surface-0/80 px-3 py-2.5 rounded"
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
        </template>
    </PanelMenu>
</template>
  
<script setup>
const props = defineProps(['dashboardNavigation', 'toggleDropdown', 'dropdowns']);
</script>
