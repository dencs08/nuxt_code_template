<template>
  <Body
    class="bg-gray-50 text-gray-800 dark:bg-surface-900 dark:text-surface-0 transition"
  >
    <header
      class="w-full bg-gray-0 border-b border-surface-100 dark:border-surface-800 shadow dark:bg-surface-950"
    >
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
        <div class="hidden lg:flex items-center lg:gap-x-2">
          <NuxtLink :to="localePath({ name: 'login' })">
            <template v-if="isUserLoggedIn">
              <Icon
                name="ic:baseline-account-circle"
                class="h-6 w-6 text-muted-color transition"
              />
              <template v-if="hasDashboardReadPermission">
                <NuxtLink :to="localePath('/dashboard')">
                  <Icon
                    name="ic:baseline-space-dashboard"
                    class="h-6 w-6 text-muted-color transition ml-2"
                  />
                </NuxtLink>
              </template>
            </template>
            <template v-else></template>
          </NuxtLink>
          <ColorModeSelector />
        </div>
        <!-- <ColorModeSelector /> -->
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
    <main>
      <slot />
    </main>
  </Body>
</template>

<script setup lang="ts">
const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();

const i18nHead = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: "id",
  addSeoAttributes: {
    canonicalQueries: [""],
  },
});

const title = computed(() => {
  const titleKey =
    typeof route.meta.title === "string" || typeof route.meta.title === "number"
      ? route.meta.title
      : "TBD";
  return t("layouts.default.title", { title: t(titleKey) });
});

useHead({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs?.lang,
  },
  title: title,
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])],
});

//navbar funcionality
const { isDarkMode } = useDarkMode();
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

const isUserLoggedIn = computed(() => !!user);
const { hasPermission } = usePermissions();
const hasDashboardReadPermission = computed(() =>
  hasPermission("dashboard", "read")
);
</script>
