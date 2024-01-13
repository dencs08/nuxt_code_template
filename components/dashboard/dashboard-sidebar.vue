<template>
  <div>
    <!-- Navbar -->
    <div
      class="fixed w-screen top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950/50 backdrop-blur px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
        <span class="sr-only">Open sidebar</span>
        <Icon name="ic:round-menu" class="h-6 w-auto" />
      </button>

      <!-- Separator -->
      <div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

      <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
        <nuxt-link :to="localePath('/')">
          <Logo type="logotype" color="black" class="h-4 w-auto hidden lg:block" />
        </nuxt-link>

        <form class="relative flex flex-1 lg:pl-28 lg:ml-10 w-full items-center">
          <div class="relative w-full">
            <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
            <InputText v-model="searchValue" placeholder="Search" class="pl-10 border-0 py-1.5 text-sm w-full" />
          </div>
        </form>

        <div class="flex items-center gap-x-4 lg:gap-x-6">
          <i v-badge.danger class="pi pi-bell hover:text-primary-500 relative cursor-pointer transition-colors" />
          <ColorModeSelector />
          <!-- Profile dropdown -->
          <button type="button" icon="pi pi-user" rounded text @click="toggleUserMenu" aria-haspopup="true"
            aria-controls="overlay_menu"
            class="group bg-gray-50 text-gray-900 rounded-full grid place-content-center p-1.5 dark:bg-gray-800 dark:text-light-0 hover:bg-white/0 hover:dark:bg-white/0 transition-colors">
            <Icon name="ic:baseline-person" class="transform group-hover:text-primary-500 transition-transform" />
          </button>
          <Menu ref="userMenu" id="overlay_menu" :model="userNavigation" :popup="true" />
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <Sidebar v-model:visible="sidebarOpen">
      <template #container="{ closeCallback }">
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between px-4 pt-4 shrink-0">
            <span class="inline-flex items-center gap-2">
              <nuxt-link :to="localePath('/')">
                <Logo type="logotype" color="black" class="h-4 w-auto" />
              </nuxt-link>
            </span>
            <span>
              <Button type="button" @click="closeCallback" icon="pi pi-times" rounded text></Button>
            </span>
          </div>
          <div class="overflow-y-auto mt-4 pl-2 pr-5">
            <PanelMenuDropdown :dashboardNavigation="dashboardNavigation" :toggleDropdown="toggleDropdown"
              :dropdowns="dropdowns" />
          </div>
          <div class="mt-auto">
            <hr class="mb-3 mx-3 border-t-1 border-surface-200 dark:border-surface-700/35" />
            <PanelMenuDropdown :dashboardNavigation="dashboardSettings" :toggleDropdown="toggleDropdown"
              :dropdowns="dropdowns" />
          </div>
        </div>
      </template>
    </Sidebar>

    <!-- Static sidebar for desktop -->
    <div class="hidden fixed top-20 lg:z-50 lg:flex lg:w-56 lg:flex-col h-full">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto pl-3 pr-2 pb-4">
        <nav class="flex flex-1 flex-col">
          <PanelMenuDropdown :dashboardNavigation="dashboardNavigation" :toggleDropdown="toggleDropdown"
            :dropdowns="dropdowns" />

          <!--Settings-->
          <div class="mt-auto mb-20">
            <Divider class="" />
            <PanelMenuDropdown :dashboardNavigation="dashboardSettings" :toggleDropdown="toggleDropdown"
              :dropdowns="dropdowns" />
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
const localePath = useLocalePath()
const userStore = useUsersStore();
const firstName = userStore.firstName;

const sidebarOpen = ref(false);
const searchValue = ref('');
const dropdowns = reactive({});
const userMenu = ref();

const toggleDropdown = (item) => {
  dropdowns[item.label] = !dropdowns[item.label];
};

const toggleUserMenu = (event) => {
  userMenu.value.toggle(event);
};

const userNavigation = computed(() => [
  {
    label: "Hi, " + firstName + "!",
    items: [
      {
        label: 'Your profile',
        icon: 'pi pi-user',
        command: () => {
          navigateTo(localePath('/dashboard/profile'));
        }
      },
      {
        label: 'Sign out',
        icon: 'pi pi-sign-out',
        command: async () => {
          try {
            const response = await signOut();
            console.log(response);
            navigateTo(localePath('/login'));
          } catch (error) {
            console.error(error);
          }
        }
      }
    ]
  }
]);
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