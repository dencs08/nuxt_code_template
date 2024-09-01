<template>
  <Dialog v-model:visible="isVisible" modal :dismissableMask="true">
    <template #container="{ closeCallback }">
      <div class="rounded-2xl flex flex-col" style="height: 400px">
        <div
          class="flex flex-row justify-between border-b border-surface-200/40 dark:border-surface-700/65 py-1 px-2.5"
          v-focustrap
        >
          <IconField class="w-full flex flex-row items-center">
            <InputIcon>
              <i class="pi pi-search text-muted-color" />
            </InputIcon>
            <InputText
              class="w-full border-0 bg-transparent text-sm m-0 p-0"
              id="input"
              type="text"
              v-model="searchQuery"
              placeholder="Search"
              autofocus
              fluid
            />
          </IconField>

          <button @click="closeCallback" class="p-0.5 text-muted-color">
            <Icon name="ic:outline-close"></Icon>
          </button>
        </div>
        <div class="flex-grow overflow-y-auto">
          <div
            v-if="filteredSections.length > 0"
            class="divide-y divide-surface-200/40 dark:divide-surface-700/65 [&>*]:py-3"
          >
            <section
              v-for="(section, index) in filteredSections"
              :key="index"
              class="px-3"
            >
              <h4 class="text-xs mb-2">{{ section.title }}</h4>
              <div v-if="section.type === 'list'" class="">
                <div
                  v-for="item in section.items"
                  :key="item.name"
                  @click="handleItemClick(item)"
                  class="flex justify-between items-center py-2 px-1 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer"
                >
                  <p
                    class="text-sm font-heading font-medium text-surface-500 dark:text-surface-150 flex items-center gap-2"
                  >
                    <span
                      :class="item.icon"
                      class="text-surface-400 dark:text-surface-250/50"
                    ></span>
                    {{ item.name }}
                  </p>
                  <component
                    v-if="isComponentItem(item)"
                    :is="item.component"
                    v-bind="item.componentProps"
                    @click.stop
                  />
                  <span
                    v-else-if="isActionItem(item)"
                    class="pi pi-chevron-right text-surface-400 dark:text-surface-250/50"
                  ></span>
                </div>
              </div>
            </section>
          </div>
          <div
            v-else
            class="p-3 text-center text-muted-color flex flex-col items-center justify-center h-full"
          >
            <div>
              <Icon name="ic:outline-search" class="h-7 w-auto"></Icon>
            </div>
            <div>No results found</div>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import ColorModeSelector from "@/core/components/utils/color-mode-selector.vue";
import LanguageSelector from "@/core/components/utils/forms/dropdown/i18n-dropdown.vue";

const localePath = useLocalePath();
const { signOut } = useAuthentication();

type ComponentItem = {
  name: string;
  icon: string;
  component: any;
  componentProps: Record<string, any>;
};

type ActionItem = {
  name: string;
  icon: string;
  action: () => void;
};

type DialogItem = ComponentItem | ActionItem;

type Section = {
  title: string;
  type: "list";
  items: DialogItem[];
};

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:visible"]);
const router = useRouter();
const isVisible = ref(props.visible);
const searchQuery = ref("");

watch(
  () => props.visible,
  (newValue) => {
    isVisible.value = newValue;
  }
);

watch(isVisible, (newValue) => {
  emit("update:visible", newValue);
});

const sections: Section[] = [
  {
    title: "Go to",
    type: "list",
    items: [
      {
        name: "Home",
        icon: "pi pi-home",
        action: () => navigateTo(localePath({ name: "dash-home" })),
      },
      {
        name: "Settings",
        icon: "pi pi-cog",
        action: () => navigateTo(localePath({ name: "dashboard-settings" })),
      },
    ],
  },
  {
    title: "Actions",
    type: "list",
    items: [
      {
        name: "Dark mode",
        icon: "pi pi-moon",
        component: ColorModeSelector,
        componentProps: {
          type: "switch",
        },
      },
      {
        name: "Language",
        icon: "pi pi-globe",
        component: LanguageSelector,
        componentProps: {},
      },
    ],
  },
  {
    title: "Other",
    type: "list",
    items: [
      {
        name: "Log Out",
        icon: "pi pi-sign-out",
        action: async () => {
          await signOut();
          navigateTo(localePath({ name: "login" }));
        },
      },
    ],
  },
];

const filteredSections = computed(() => {
  if (!searchQuery.value) {
    return sections;
  }

  const query = searchQuery.value.toLowerCase();
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.name.toLowerCase().includes(query)
      ),
    }))
    .filter((section) => section.items.length > 0);
});

function isComponentItem(item: DialogItem): item is ComponentItem {
  return "component" in item && "componentProps" in item;
}

function isActionItem(item: DialogItem): item is ActionItem {
  return "action" in item;
}

function handleItemClick(item: DialogItem) {
  if (isActionItem(item)) {
    item.action();
    isVisible.value = false;
  }
}
</script>
