<template>
    <div @click="toggle" ref="toggleButton">
        <NuxtLink :to="{ name: to }"
            class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-white hover:text-gray-700 transition-colors duration-200">
            <Icon v-if="icon" :name="icon" class="h-6 w-auto" />
            <span v-if="!icon && !noIcon"
                class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-400 group-hover:text-gray-800">
                {{ initial }}
            </span>
            <span class="w-full flex justify-between">
                <slot />
                <span v-if="list.length > 0 && !noIcon">
                    <Icon name="ic:round-keyboard-arrow-right" class="w-6 h-auto transition-transform duration-200"
                        :class="toggleValue ? 'rotate-180' : ''" />
                </span>
            </span>
        </NuxtLink>
        <div v-if="list.length > 0" class="absolute right-0 -translate-y-1/2" v-auto-animate>
            <div v-if="toggleValue" class="absolute -bottom-3 left-0 bg-white shadow-lg min-w-[150px] z-99 rounded-md"
                ref="dropdown">
                <NuxtLink v-for="(  item, index  ) in   list  " :key="index" :to="{ name: item.href }"
                    class="block px-4 py-3 hover:bg-gray-200 rounded-md">
                    <Icon v-if="item.icon" :name="item.icon" class="h-4 w-4 mr-2 inline-block" />
                    {{ item.name }}
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    icon: String,
    to: String,
    list: {
        type: Array,
        default: () => [],
    },
    noIcon: { type: Boolean, default: false }
});

const slots = useSlots();
const children = slots.default()[0].children;
let initial = computed(() => {
    if (children) {
        return children[0].toUpperCase();
    }
    return '';
});

const { dropdown, toggleButton, toggleValue, toggle } = useOutsideClick();
</script>
<style lang="scss" scoped>
.router-link-exact-active {
    @apply bg-gray-800 text-primary-100;

    @screen lg {
        @apply bg-gray-50 text-primary-400;
    }
}
</style>