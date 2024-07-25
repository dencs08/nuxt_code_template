<template>
  <div>
    <!-- Navbar -->
    <div
      class="fixed w-screen top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-surface-100 dark:border-surface-800 bg-white dark:bg-surface-950/50 backdrop-blur px-4 shadow sm:gap-x-6 sm:px-6 lg:px-8"
    >
      <button
        type="button"
        class="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        @click="sidebarOpen = true"
      >
        <span class="sr-only">Open sidebar</span>
        <Icon name="ic:round-menu" class="h-6 w-auto" />
      </button>

      <!-- Separator -->
      <div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

      <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
        <nuxt-link :to="localePath({ name: 'index' })">
          <Logo
            type="symbol"
            :color="isDark ? 'white' : 'black'"
            height="25px"
            width="25px"
          />
        </nuxt-link>

        <form
          class="relative flex flex-1 lg:pl-28 lg:ml-10 w-full items-center"
        >
          <IconField class="w-full">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="value1"
              placeholder="Search"
              class="!border-0 !shadow-none w-full"
            />
          </IconField>
        </form>

        <div class="flex items-center gap-x-4 lg:gap-x-6">
          <OverlayBadge value="1">
            <i
              class="pi pi-bell hover:text-primary-500 relative cursor-pointer transition-colors text-md"
            />
          </OverlayBadge>
          <ColorModeSelector />
          <!-- Profile dropdown -->
          <button
            type="button"
            icon="pi pi-user"
            rounded
            text
            @click="toggleUserMenu"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            class="group bg-gray-50 text-gray-900 rounded-full grid place-content-center p-1.5 dark:bg-gray-800 dark:text-light-0 hover:bg-white/0 hover:dark:bg-white/0 transition-colors"
          >
            <Icon
              name="ic:baseline-person"
              class="transform group-hover:text-primary-500 transition-transform"
            />
          </button>
          <Menu
            ref="userMenu"
            id="overlay_menu"
            :model="userNavigation"
            :popup="true"
          />
        </div>
      </div>
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
            <hr
              class="mb-3 mx-3 border-t-1 border-surface-200 dark:border-surface-700/35"
            />
            <PanelMenuDropdown :navigation="dashboardSettings" />
          </div>
        </div>
      </template>
    </Drawer>

    <!-- Static sidebar for desktop -->
    <div
      class="hidden fixed top-16 lg:z-50 lg:flex lg:w-56 lg:flex-col h-full bg-white shadow-[4px_0_5px_-5px_rgba(0,0,0,0.3)] dark:bg-surface-950/50 border-r border-surface-100 dark:border-surface-800"
    >
      <div class="flex grow flex-col gap-y-5 overflow-y-auto px-3 pb-4 pt-4">
        <nav class="flex flex-1 flex-col">
          <PanelMenuDropdown :navigation="dashboardNavigation" />

          <!--Settings-->
          <div class="mt-auto mb-14">
            <!-- <Divider class="" /> -->
            <PanelMenuDropdown :navigation="dashboardSettings" />
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
          navigateTo(localePath({ name: "dash-user-account" }));
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
