<template>
  <div @mouseenter="toggle(true)" @mouseleave="toggle(false)">
    <div>
      <NuxtLink :to="to"
                class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-white hover:text-gray-700 transition-colors duration-200">
        <Icon v-if="icon" :name="icon" class="h-6 w-auto" />
        <span v-if="!icon && !noIcon"
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-400 group-hover:text-gray-800">
          {{ initial }}
        </span>
        <span class="w-full flex justify-between">
          <slot />
          <span v-if="list.length > 0 && !noIcon">
            <Icon name="ic:round-keyboard-arrow-right" class="w-6 h-auto transition-transform duration-200"
                  :class="toggleValue ? 'rotate-180' : ''" />
          </span>
        </span>
      </NuxtLink>
    </div>
    <!--children list with condintional rendering starts here-->
    <div v-if="list.length > 0" class="relative" v-auto-animate>
      <div v-if="isActive" class="2">
        <NuxtLink v-for="(item, index) in list" :key="index" :to="item.to"
                  class="block px-4 py-2 hover:bg-gray-200 rounded-md text-gray-600 text-sm">
          {{ item.name }}
        </NuxtLink>
      </div>
    </div>

    <!--tooltip starts here-->
    <div v-if="list.length > 0 && !isActive"
         class="absolute right-0 -translate-y-1/2 z-[9999]"
         v-auto-animate
         @mouseenter="cancelHideTooltip"
         @mouseleave="startHideTooltip">
      <div v-if="toggleValue"
           class="absolute -bottom-3 left-0 bg-white shadow-lg min-w-[150px] rounded-md">
        <NuxtLink v-for="(item, index) in list"
                  :key="index"
                  :to="item.to"
                  class="block px-4 py-3 hover:bg-gray-200 rounded-md text-gray-600 text-sm">
          {{ item.name }}
        </NuxtLink>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  icon: String,
  to: String,
  list: {
    type: Array,
    default: () => [],
  },
  noIcon: { type: Boolean, default: false },
  children: { type: String, default: '' }
});

const route = useRoute();

const isActive = ref(false);
const toggleValue = ref(false);

const updateActive = () => {
  isActive.value = route.path.includes(props.to || '');
  if (isActive.value) {
    toggleValue.value = false;
  }
};

// Call updateActive initially and whenever the route changes
watchEffect(() => {
  updateActive();
});

let timer: NodeJS.Timeout | null = null;

const toggle = (value: boolean) => {
  cancelHideTooltip();
  if (!isActive.value) {
    if (value) {
      toggleValue.value = true;
    } else {
      startHideTooltip();
    }
  }
};

const startHideTooltip = () => {
  timer = setTimeout(() => {
    toggleValue.value = false;
  }, 500); // Hide after 500ms
};

const cancelHideTooltip = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
};

let initial = computed(() => props.children ? props.children[0].toUpperCase() : '');
</script>


<style lang="scss" scoped>
.router-link-exact-active {
  @apply bg-gray-800 text-primary-100;

  @screen lg {
    @apply bg-gray-50 text-primary-400;
  }
}
</style>
