<template>
  <div>
    <div
      class="lg:hidden px-6 py-2 mb-2 flex gap-2 items-center justify-between border-b border-surface-100 dark:border-surface-800"
    >
      <div class="flex gap-2 items-center">
        <button
          type="button"
          class="text-gray-700 lg:hidden"
          @click="sidebarOpen = true"
        >
          <span class="sr-only">Open sidebar</span>
          <Icon name="ic:round-menu" class="h-6 w-auto" />
        </button>
        <Breadcrumbs class="lg:hidden" />
      </div>
      <!-- <ColorModeSelector /> -->
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <Drawer v-model:visible="sidebarOpen">
      <template #container="{ closeCallback }">
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between px-4 pt-4 shrink-0">
            <span class="inline-flex items-center gap-2">
              <nuxt-link :to="localePath({ name: 'index' })">
                <Logo
                  type="symbol"
                  :color="isDark ? 'white' : 'black'"
                  height="25px"
                  width="25px"
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
          <div class="overflow-y-auto mt-4 pl-2 pr-5">
            <PanelMenuDropdown :navigation="dashboardNavigation" />
          </div>
          <div class="mt-auto">
            <div class="mt-auto">
              <Divider class="mb-2.5" />
              <div class="flex items-center gap-x-4 lg:gap-x-6 mb-2">
                <!-- Profile dropdown -->
                <Button
                  text
                  @click="toggleUserMenu"
                  aria-haspopup="true"
                  aria-controls="overlay_menu"
                  class="flex flex-row w-full gap-2 justify-between items-center"
                >
                  <div class="flex flex-row gap-2">
                    <ProfileAvatar
                      size="small"
                      class="rounded-full w-6 shadow-none"
                    />
                    <span class="font-medium">{{ firstName }}</span>
                    <Badge value="2"></Badge>
                  </div>
                  <Icon name="ic:baseline-more-vert" class="h-5 w-auto"></Icon>
                </Button>
                <Menu
                  ref="userMenu"
                  id="overlay_menu"
                  :model="userNavigation"
                  :popup="true"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </Drawer>

    <!-- Static sidebar for desktop -->
    <div
      class="hidden fixed lg:z-50 lg:flex lg:w-56 lg:flex-col h-full bg-white dark:bg-surface-950/50 border-r border-surface-100 dark:border-surface-800"
    >
      <div class="flex grow flex-col gap-y-5 overflow-y-auto px-3 pb-2 pt-4">
        <nuxt-link :to="localePath({ name: 'index' })">
          <Logo
            type="symbol"
            :color="isDark ? 'white' : 'black'"
            height="25px"
            width="25px"
          />
        </nuxt-link>
        <nav class="flex flex-1 flex-col w-auto overflow-hidden">
          <IconField class="overflow-hidden flex mb-2 shadow-sm">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="searchValue"
              placeholder="Search"
              size="small"
              class="flex-1 w-full"
            />
            <InputIcon
              class="border border-surface rounded bg-emphasis text-muted-color text-xs"
            >
              {{ $device.isWindows ? "Ctrl+k" : "⌘+k" }}
            </InputIcon>
          </IconField>
          <PanelMenuDropdown :navigation="dashboardNavigation" />

          <!--Profile-->
          <div class="mt-auto">
            <Menu
              ref="userMenu"
              id="overlay_menu"
              :model="userNavigation"
              :popup="true"
            />
            <Divider class="mb-2.5" />
            <div class="flex items-center gap-x-4 lg:gap-x-6">
              <!-- Profile dropdown -->
              <Button
                text
                @click="toggleUserMenu"
                aria-haspopup="true"
                aria-controls="overlay_menu"
                class="flex flex-row w-full gap-2 justify-between items-center"
              >
                <div class="flex flex-row gap-2">
                  <ProfileAvatar
                    size="small"
                    class="rounded-full w-6 shadow-none"
                  />
                  <span class="font-medium">{{ firstName }}</span>
                  <Badge value="2"></Badge>
                </div>
                <Icon name="ic:baseline-more-vert" class="h-5 w-auto"></Icon>
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  navigation: Array,
  teams: Array,
  userNavigation: Array,
});

const { dashboardNavigation, dashboardSettings } = useNavigation();
const { signOut } = useAuthentication();
const localePath = useLocalePath();
const userStore = useUserStore();
const firstName = userStore.firstName;
const isDark = useDark();

const sidebarOpen = ref(false);
const searchValue = ref("");
const userMenu = ref();

const toggleUserMenu = (event) => {
  userMenu.value.toggle(event);
};

const userNavigation = computed(() => [
  {
    label: "Hi, " + firstName + "!",
    items: [
      {
        label: "Your profile",
        icon: "pi pi-user",
        command: () => {
          navigateTo(localePath({ name: "dash-account" }));
        },
      },
      {
        label: "Settings",
        icon: "pi pi-cog",
        command: () => {
          navigateTo(localePath("/dashboard/settings"));
        },
      },
      {
        label: "Sign out",
        icon: "pi pi-sign-out",
        command: async () => {
          try {
            await signOut();
            navigateTo(localePath({ name: "login" }));
          } catch (error) {
            console.error(error);
          }
        },
      },
    ],
  },
]);
</script>

<style scoped>
/* Add your styles here */
</style>
