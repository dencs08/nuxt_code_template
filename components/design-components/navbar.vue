<template>
    <header class="z-[99] fixed w-full transition-transform duration-300 ease-in-out bg-white shadow"
        :class="{ '-translate-y-full': !showHeader }">
        <nav class="container mx-auto flex items-center justify-between py-5" aria-label="Global">
            <NuxtLink :to="localePath('index')">
                <Logo type="logotype" color="black" class="h-5 w-auto" />
            </NuxtLink>
            <div class="flex lg:hidden">
                <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    @click="mobileMenuOpen = true">
                    <span class="sr-only">Open main menu</span>
                    <Bars3Icon class="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
            <div class="hidden lg:flex items-center lg:gap-x-12">
                <NuxtLink v-for="item in navigation" :key="item.name" :to="item.to"
                    class="text-sm font-semibold leading-6 text-gray-900">
                    {{ item.name }}
                </NuxtLink>

                <NuxtLink :to="localePath('/login')">
                    <MyButton size="xs">
                        Login
                    </MyButton>
                </NuxtLink>
            </div>
        </nav>
        <Transition name="slide">
            <div class="lg:hidden" v-if="mobileMenuOpen">
                <div class="fixed inset-0 z-10" />
                <div
                    class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div class="flex items-center justify-between">
                        <Logo type="logotype" color="black" class="h-5 w-auto" />
                        <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
                            <span class="sr-only">Close menu</span>
                            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div class="mt-6 flow-root">
                        <div class="-my-6 divide-y divide-gray-500/10">
                            <div class="space-y-2 py-6">
                                <NuxtLink v-for="item in navigation" :key="item.name" :to="item.to"
                                    class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 cursor-pointer">
                                    {{ item.name }}
                                </NuxtLink>
                            </div>
                            <div class="py-6">
                                <LangSwitcher />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </header>
</template>

<script setup>
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const localePath = useLocalePath()
const { navigation } = useNavigation();
const { scrollToElement } = useSmoothScroll();

const mobileMenuOpen = ref(false)
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
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
}
</style>
