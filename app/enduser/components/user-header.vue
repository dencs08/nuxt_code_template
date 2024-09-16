<template>
  <header class="w-full">
    <div class="border-b border-surface-500/30 mx-36">
      <nav
        class="container mx-auto flex items-center justify-between py-5"
        aria-label="Global menu navigation"
      >
        <div class="flex flex-row gap-10 items-center justify-center">
          <ClientOnly>
            <NuxtLink :to="localePath({ name: 'index' })">
              <Logo
                type="symbol"
                :color="isDarkMode ? 'white' : 'white'"
                height="25px"
                width="25px"
                @click="sidebarOpen = false"
              />
            </NuxtLink>
          </ClientOnly>
          <div class="flex flex-row gap-4">
            <NuxtLink
              v-for="item in userNavbarMenu"
              :key="item.label"
              :to="item.route"
              :exact-active-class="'bg-surface-500/40 rounded'"
              class="text-sm font-semibold leading-6 text-surface-50 cursor-pointer"
            >
              <Button
                size="small"
                class="!py-0.5 !px-3 !text-surface-50"
                text
                >{{ item.label }}</Button
              >
            </NuxtLink>
          </div>
        </div>
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
        <div class="hidden lg:flex items-center lg:gap-x-5">
          <ColorModeSelector :adjust-color="false" />
          <NuxtLink
            :to="localePath('/main/account')"
            class="flex flex-gap-2 items-center"
          >
            <ClientOnly>
              <template v-if="isUserLoggedIn">
                <ProfileAvatar
                  @click.prevent="toggleUserMenu"
                  aria-haspopup="true"
                  aria-controls="overlay_menu"
                  class="rounded-full h-9 w-9 shadow-none"
                />
              </template>
              <template v-else></template>
            </ClientOnly>
          </NuxtLink>
        </div>
      </nav>
    </div>

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
                <ClientOnly>
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
                </ClientOnly>
              </NuxtLink>
            </div>
            <div class="w-full flex justify-center items-center">
              <SocialIcons class="mt-4" />
            </div>
          </div>
        </div>
      </template>
    </Drawer>

    <Menu
      :model="userNavigation"
      ref="userMenu"
      id="overlay_menu"
      :popup="true"
      class="w-full md:w-56"
      :pt="{
        submenuLabel: ['!m-0 !pt-0 !pb-1.5 !px-1.5'],
      }"
    >
      <template #submenulabel="{ item }">
        <span class="text-xs text-muted-color !p-0 !m-0">{{ item.label }}</span>
      </template>
      <template #item="{ item, props }">
        <a class="flex items-center !mt-0 !p-1" v-bind="props.action">
          <span
            :class="item.icon"
            class="text-surface-200 dark:text-surface-300/50"
          />
          <span class="text-surface-400 dark:text-surface-100/80 text-sm">{{
            item.label
          }}</span>
          <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
          <span
            v-if="item.shortcut"
            class="ml-auto border border-surface-200 dark:border-surface-500 bg-emphasis text-muted-color rounded text-xs p-0.5"
            >{{ item.shortcut }}</span
          >
        </a>
      </template>
      <template #end> </template>
    </Menu>
  </header>
</template>

<script setup lang="ts">
const route = useRoute();
const { userNavbarMenu } = useNavigation();
const localePath = useLocalePath();
const { isDarkMode } = useDarkMode();
const userStore = useUserStore();
const user = userStore.getUser;
const { signOut } = useAuthentication();

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

const userMenu = ref();

const toggleUserMenu = (event: any) => {
  userMenu.value.toggle(event);
};

const userNavigation = computed(() => {
  const baseNavigation = [
    {
      label: "Hi, " + user.email,
      items: [
        {
          separator: true,
        },
        {
          label: "Your profile",
          icon: "pi pi-user",
          command: () => {
            navigateTo(localePath("/main/account"));
          },
        },
        {
          separator: true,
        },
        {
          label: "Settings",
          icon: "pi pi-cog",
          command: () => {
            navigateTo(localePath("/main/settings"));
          },
        },
        {
          label: "Help",
          icon: "pi pi-question-circle",
          command: () => {
            console.log("Help");
          },
        },
        {
          separator: true,
        },
        {
          label: "Sign out",
          icon: "pi pi-sign-out",
          command: async () => {
            await signOut();
            navigateTo(localePath({ name: "login" }));
          },
        },
      ],
    },
  ];

  // Add dashboard item only if user has permission
  if (hasDashboardReadPermission.value) {
    baseNavigation[0].items.splice(3, 0, {
      label: "Dashboard",
      icon: "pi pi-home",
      command: () => {
        navigateTo(localePath("/dashboard/home"));
      },
    });
  }

  return baseNavigation;
});
</script>

<style scoped></style>
