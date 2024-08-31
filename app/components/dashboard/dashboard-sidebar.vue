<template>
  <div>
    <div
      class="lg:hidden px-6 py-2 mb-2 flex gap-2 items-center justify-between border-b border-surface-100 dark:border-surface-800 transition"
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
                  :color="isDarkMode ? 'white' : 'black'"
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
                    <span class="font-medium">{{
                      user.name.split(" ")[0]
                    }}</span>
                    <Badge value="2"></Badge>
                  </div>
                  <Icon name="ic:baseline-more-vert" class="h-5 w-auto"></Icon>
                </Button>
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
            :color="isDarkMode ? 'white' : 'black'"
            height="25px"
            width="25px"
          />
        </nuxt-link>
        <nav class="flex flex-1 flex-col w-auto overflow-hidden">
          <IconField
            class="overflow-hidden mb-2 shadow-sm"
            @click="showCommandPalette"
          >
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="searchValue"
              placeholder="Search"
              size="small"
              class="flex-1 w-full"
              readonly
            />
            <InputIcon
              class="border border-surface-100 dark:border-surface-600 p-0.5 -my-2.5 rounded bg-emphasis text-muted-color text-xs"
            >
              {{ $device.isWindows ? "Ctrl+k" : "⌘+k" }}
            </InputIcon>
          </IconField>
          <PanelMenuDropdown :navigation="dashboardNavigation" />

          <!--Profile-->
          <div class="mt-auto">
            <Menu
              :model="userNavigation"
              ref="userMenu"
              id="overlay_menu"
              :popup="true"
              class="w-full md:w-56"
              :pt="{
                submenuLabel: ['m-0 pt-0 pb-1.5 px-1.5'],
              }"
            >
              <template #submenulabel="{ item }">
                <span class="text-xs text-muted-color p-0 m-0">{{
                  item.label
                }}</span>
              </template>
              <template #item="{ item, props }">
                <a class="flex items-center mt-0 p-1" v-bind="props.action">
                  <span
                    :class="item.icon"
                    class="text-surface-200 dark:text-surface-300/50"
                  />
                  <span
                    class="text-surface-400 dark:text-surface-100/80 text-sm"
                    >{{ item.label }}</span
                  >
                  <Badge
                    v-if="item.badge"
                    class="ml-auto"
                    :value="item.badge"
                  />
                  <span
                    v-if="item.shortcut"
                    class="ml-auto border border-surface-200 dark:border-surface-500 bg-emphasis text-muted-color rounded text-xs p-0.5"
                    >{{ item.shortcut }}</span
                  >
                </a>
              </template>
              <template #end> </template>
            </Menu>
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
                  <span class="font-medium">{{ user.name.split(" ")[0] }}</span>
                  <Badge value="2"></Badge>
                </div>
                <Icon name="ic:baseline-more-vert" class="h-5 w-auto"></Icon>
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </div>
    <CommandPalette
      v-model:visible="isCommandPaletteVisible"
      class="min-w-[50vw]"
    />
  </div>
</template>

<script setup>
import CommandPalette from "@/components/utils/command-pallete.vue";
const props = defineProps({
  navigation: Array,
  teams: Array,
  userNavigation: Array,
});

const { dashboardNavigation, dashboardSettings } = useNavigation();
const { signOut } = useAuthentication();
const localePath = useLocalePath();
const userStore = useUserStore();
const user = userStore.getUser;
const { isDarkMode } = useDarkMode();
const device = useDevice();

const sidebarOpen = ref(false);
const searchValue = ref("");
const userMenu = ref();
const isCommandPaletteVisible = ref(false);

const toggleUserMenu = (event) => {
  userMenu.value.toggle(event);
};

const showCommandPalette = () => {
  isCommandPaletteVisible.value = true;
};

const userNavigation = computed(() => [
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
          navigateTo(localePath({ name: "dash-account" }));
        },
      },
      {
        separator: true,
      },
      {
        label: "Settings",
        icon: "pi pi-cog",
        command: () => {
          navigateTo(localePath("/dashboard/settings"));
        },
      },
      {
        label: "Command menu",
        icon: "pi pi-search",
        shortcut: device.isWindows ? "Ctrl+k" : "⌘+k",
        command: () => {
          showCommandPalette();
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
]);

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

const handleKeydown = (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "k") {
    event.preventDefault();
    showCommandPalette();
  }
};
</script>
