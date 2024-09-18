<template>
  <header
    class="z-[99] fixed w-full transition-transform duration-300 ease-in-out bg-white/60 dark:bg-surface-900/60 backdrop-blur-md shadow"
    :class="{ '-translate-y-full': !showHeader }"
  >
    <!-- Desktop -->
    <nav
      class="container mx-auto flex items-center justify-between py-5"
      aria-label="Global menu navigation"
    >
      <ClientOnly>
        <NuxtLink :to="localePath({ name: 'index' })">
          <Logo
            type="symbol"
            :color="isDarkMode ? 'white' : 'black'"
            height="25px"
            width="25px"
            @click="sidebarOpen = false"
          />
        </NuxtLink>
      </ClientOnly>
      <div class="flex lg:hidden">
        <button
          type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          @click="sidebarOpen = true"
        >
          <span class="sr-only">Open main menu</span>
          <Icon name="ic:outline-menu" class="h-6 w-6" />
        </button>
      </div>
      <div class="hidden lg:flex items-center lg:gap-x-12">
        <NuxtLink
          v-for="item in navbarMenu"
          :key="item.label"
          :to="item.route"
          class="text-sm font-semibold text-gray-900 cursor-pointer transition duration-1000 ease-in-out"
          :exact-active-class="'border-b border-primary-800 dark:border-primary-200'"
        >
          {{ item.label }}
        </NuxtLink>
        <div class="space-x-2">
          <ClientOnly>
            <template v-if="isUserLoggedIn">
              <NuxtLink :to="localePath({ name: 'login' })">
                <Icon
                  name="ic:baseline-account-circle"
                  class="h-6 w-6 text-primary-800/75 hover:text-primary-500 dark:text-primary-200/75 hover:dark:text-primary-400 transition"
                />
              </NuxtLink>
              <NuxtLink
                v-if="hasDashboardReadPermission"
                :to="localePath('/dashboard')"
              >
                <Icon
                  name="ic:baseline-space-dashboard"
                  class="h-6 w-6 text-primary-800/75 hover:text-primary-500 dark:text-primary-200/75 hover:dark:text-primary-400 transition"
                />
              </NuxtLink>
            </template>
            <NuxtLink v-else :to="localePath({ name: 'login' })">
              <MyButton size="xs"> Login </MyButton>
            </NuxtLink>
          </ClientOnly>
        </div>
      </div>
    </nav>

    <!-- Mobile -->
    <Drawer v-model:visible="sidebarOpen">
      <template #container="{ closeCallback }">
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between px-4 pt-4 shrink-0">
            <span class="inline-flex items-center gap-2">
              <nuxt-link :to="localePath({ name: 'index' })">
                <Logo
                  type="symbol"
                  :color="isDarkMode ? 'white' : 'black'"
                  height="25px"
                  width="25px"
                  @click="sidebarOpen = false"
                />
              </nuxt-link>
            </span>
            <span>
              <Button
                type="button"
                @click="closeCallback"
                icon="pi pi-times"
                rounded
                text
              ></Button>
            </span>
          </div>
          <Divider class="mt-4 mb-2" />
          <div class="overflow-y-auto mt-1 pl-2 pr-5">
            <PanelMenuDropdown
              :navigation="navbarMenu"
              @click="sidebarOpen = false"
            />
            <div class="mt-3">
              <NuxtLink :to="localePath({ name: 'login' })">
                <template v-if="isUserLoggedIn">
                  <Icon name="ic:outline-account-circle" class="h-6 w-6" />
                  <template v-if="hasDashboardReadPermission">
                    <NuxtLink :to="localePath('/dashboard')">
                      <Icon name="ic:outline-dashboard" class="h-6 w-6" />
                    </NuxtLink>
                  </template>
                </template>
                <template v-else>
                  <MyButton class="w-full" size="xs"> Login </MyButton>
                </template>
              </NuxtLink>
            </div>
            <div class="w-full flex justify-center items-center">
              <SocialIcons class="mt-4" />
            </div>
          </div>
        </div>
      </template>
    </Drawer>
  </header>
</template>

<script setup>
const { isDarkMode } = useDarkMode();
const localePath = useLocalePath();
const { navbarMenu } = useNavigation();
const { scrollToElement } = useSmoothScroll();

const userStore = useUserStore();
const user = userStore.getUser;

const sidebarOpen = ref(false);
const lastScrollPosition = ref(0);
const showHeader = ref(true);

const { y } = useWindowScroll();
watch(y, (newScrollPosition) => {
  if (import.meta.client && window.matchMedia("(min-width: 1025px)").matches) {
    showHeader.value = newScrollPosition <= lastScrollPosition.value;
    lastScrollPosition.value = newScrollPosition;
  }
});

const { hasPermission } = usePermissions();

const isUserLoggedIn = computed(() => !!user);
const hasDashboardReadPermission = computed(() =>
  hasPermission("dashboard", "read")
);
</script>
