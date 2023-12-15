<template>
  <div>
    <!-- Navbar -->
    <div
      class="fixed w-screen top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
        <span class="sr-only">Open sidebar</span>
        <Icon name="ic:round-menu" class="h-6 w-auto" />
      </button>

      <!-- Separator -->
      <div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

      <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
        <Logo type="logotype" color="black" class="h-4 w-auto hidden lg:block" />

        <form class="relative flex flex-1 lg:pl-28 items-center" action="#" method="GET">
          <label for="search-field" class="sr-only">Search</label>
          <Icon name="ic:round-search" class="h-6 w-auto text-gray-400" />
          <input id="search-field"
            class="block h-full w-full border-0 py-0 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search..." type="search" name="search" />
        </form>
        <div class="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
            <span class="sr-only">View notifications</span>
            <Icon name="ic:round-notifications-none" class="h-6 w-auto" />
          </button>

          <!-- Separator -->
          <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

          <!-- Profile dropdown -->

          <Menu as="div" class="relative">
            <MenuButton class="-m-1.5 flex items-center p-1.5">
              <span class="sr-only">Open user menu</span>
              <div class="p-1 h-7 w-7 grid place-content-center bg-gray-100 rounded-full">
                <Icon name="ic:round-person" />
              </div>
              <span class="hidden lg:flex lg:items-center">
                <span class="ml-4 mr-1 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                  <!--{{ user.name }}-->
                </span>
                <Icon name="ic:round-keyboard-arrow-down" class="h-5 w-auto block" />
              </span>
            </MenuButton>
            <transition name="fade">
              <MenuItems
                class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                <MenuItem v-for="item in userNavigation" :key="item.name" @click="handleItemClick(item)">
                <NuxtLink :to="item.to" class="block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer">
                  {{ item.name }}
                </NuxtLink>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
          enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100"
          leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                <div class="flex h-16 shrink-0 items-center justify-between">
                  <Logo type="logotype" color="white" class="h-4 w-auto" />
                  <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                    enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                    <div>
                      <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                        <span class="sr-only">Close sidebar</span>
                        <Icon name="ic:round-close" class="h-6 w-auto text-gray-200" />
                      </button>
                    </div>
                  </TransitionChild>
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7 list-none">
                    <li v-for="(section, index) in dashboardNavigation" :key="section.name">
                      <h3 class="text-xs font-semibold leading-5 text-dark-200 uppercase mb-1 flex items-center gap-1"
                        @click="toggleList(index)">
                        {{ section.name }}
                        <Icon name="ic:round-arrow-drop-down" class="h-6 w-auto transition-transform"
                          :class="{ 'transform rotate-180': !listVisibility[index] }" />
                      </h3>
                      <ul role="list" class="space-y-1 list-none" v-if="listVisibility[index]">
                        <li v-for="item in section.items" :key="item.name">
                          <CardLink :to="item.to" :icon="item.icon" :list="item.children">
                            {{ item.name }}
                          </CardLink>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden fixed top-20 lg:z-50 lg:flex lg:w-56 lg:flex-col h-full">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex grow flex-col gap-y-5 overflow-y-auto pl-6 pr-3 pb-4">
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7 list-none">
            <li v-for="(section, index) in dashboardNavigation" :key="section.name">
              <h3
                class="text-xs font-semibold leading-5 text-dark-200 uppercase mb-1 flex items-center gap-1 cursor-pointer"
                @click="toggleList(index)">
                {{ section.name }}
                <Icon name="ic:round-arrow-drop-down" class="h-6 w-auto transition-transform"
                  :class="{ 'transform rotate-180': !listVisibility[index] }" />
              </h3>
              <ul role="list" class="space-y-1 list-none" v-if="listVisibility[index]">
                <li v-for="item in section.items" :key="item.name">
                  <CardLink :to="item.to" :icon="item.icon" :list="item.children">
                    {{ item.name }}
                  </CardLink>
                </li>
              </ul>
            </li>
            <!--Settings-->
            <ul v-for="(section, index) in dashboardSettings" :key="section.name" class="mt-auto mb-20">
              <li v-for="item in section.items" :key="item.name" class="list-none">
                <CardLink :to="item.to" :icon="item.icon" :list="item.children">
                  {{ item.name }}
                </CardLink>
              </li>
            </ul>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  TransitionRoot, Dialog, TransitionChild, DialogPanel, Menu, MenuButton, MenuItems, MenuItem
} from '@headlessui/vue';

const { dashboardNavigation, dashboardSettings } = useNavigation();
const props = defineProps({
  navigation: Array,
  teams: Array,
  userNavigation: Array,
});

const sidebarOpen = ref(false);

const user = useSupabaseUser();
const client = useSupabaseClient();
const localePath = useLocalePath()

const { signOut } = useAuthentication();

const handleItemClick = async (item) => {
  if (item.name === 'Sign out') {
    try {
      const response = await signOut();
      console.log(response);
      navigateTo(localePath('/login'));
    } catch (error) {
      console.error(error);
    }
  }
};

const userNavigation = computed(() => [
  { name: 'Your profile', to: localePath('/dashboard/profile') },
  { name: 'Sign out' },
]);

const listVisibility = reactive({});

const toggleList = (index) => {
  listVisibility[index] = !listVisibility[index];
};

onMounted(() => {
  dashboardNavigation.value.forEach((section, index) => {
    listVisibility[index] = true;
  });
});


</script>