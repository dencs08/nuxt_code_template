<template>
    <header class="z-[99] fixed w-full transition-transform duration-300 ease-in-out bg-white/60 backdrop-blur-md shadow"
        :class="{ '-translate-y-full': !showHeader }">
        <nav class="container mx-auto flex items-center justify-between py-5" aria-label="Global">
            <NuxtLink :to="localePath({ name: 'index' })">
                <Logo type="symbol" :color="isDark ? 'white' : 'black'" height="25px" width="25px"
                    @click="sidebarOpen = false" />
            </NuxtLink>
            <div class="flex lg:hidden">
                <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    @click="sidebarOpen = true">
                    <span class="sr-only">Open main menu</span>
                    <Icon name="ic:outline-menu" class="h-6 w-6" />
                </button>
            </div>
            <div class="hidden lg:flex items-center lg:gap-x-12">
                <NuxtLink v-for="item in navigation" :key="item.label" :to="item.route"
                    class="text-sm font-semibold leading-6 text-gray-900 cursor-pointer">
                    {{ item.label }}
                </NuxtLink>
                <NuxtLink :to="localePath({ name: 'login' })">
                    <MyButton size="xs">
                        Login
                    </MyButton>
                </NuxtLink>
            </div>
        </nav>

        <Sidebar v-model:visible="sidebarOpen">
            <template #container="{ closeCallback }">
                <div class="flex flex-col h-full">
                    <div class="flex items-center justify-between px-4 pt-4 shrink-0">
                        <span class="inline-flex items-center gap-2">
                            <nuxt-link :to="localePath({ name: 'index' })">
                                <Logo type="symbol" :color="isDark ? 'white' : 'black'" height="25px" width="25px"
                                    @click="sidebarOpen = false" />
                            </nuxt-link>
                        </span>
                        <span>
                            <Button type="button" @click="closeCallback" icon="pi pi-times" rounded text></Button>
                        </span>
                    </div>
                    <Divider />
                    <div class="overflow-y-auto mt-4 pl-2 pr-5">
                        <PanelMenuDropdown :navigation="navigation" @click="sidebarOpen = false" />
                        <div class="mt-6">
                            <NuxtLink :to="localePath({ name: 'login' })">
                                <MyButton class="w-full" size="xs">
                                    Login
                                </MyButton>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </template>
        </Sidebar>
    </header>
</template>

<script setup>
const isDark = useDark();
const localePath = useLocalePath()
const { navigation } = useNavigation();
const { scrollToElement } = useSmoothScroll();

const sidebarOpen = ref(false);
const lastScrollPosition = ref(0)
const showHeader = ref(true)

const { y } = useWindowScroll()
watch(y, (newScrollPosition) => {
    if (window.matchMedia("(min-width: 1025px)").matches) {
        showHeader.value = newScrollPosition <= lastScrollPosition.value
        lastScrollPosition.value = newScrollPosition
    }
})
</script>

<style scoped>
.dashboard-custom-panel :deep(div[data-pc-section="headercontent"]),
.dashboard-custom-panel :deep(div[data-pc-section="menucontent"]),
.dashboard-custom-panel :deep(div[data-pc-section="header"]),
.dashboard-custom-panel :deep(div[data-pc-section="menu"]) {
    border: none !important;
    outline: none !important;
    background-color: #00000000 !important;
}

.dashboard-custom-panel :deep(div[data-pc-section="menu"]),
.dashboard-custom-panel :deep(div[data-pc-section="menucontent"]) {
    margin-left: 10px !important;
    margin-top: -8px !important;
}
</style>

<style></style>
