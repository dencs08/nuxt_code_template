<template>
  <Dialog v-model:visible="isVisible" modal :dismissableMask="true">
    <template #container="{ closeCallback }">
      <div class="flex flex-col py-3 gap-6 rounded-2xl">
        <div class="flex flex-row justify-between">
          <AutoComplete
            icon="pi pi-search"
            v-model="selectedCommand"
            :suggestions="filteredCommands"
            @complete="searchCommands"
            placeholder="Search"
            @item-select="executeCommand"
            size="small"
            autofocus
            optionLabel="label"
            inputClass="w-full border-0 bg-transparent"
          />
          <Button
            icon="pi pi-times"
            @click="closeCallback"
            text
            size="small"
          ></Button>
        </div>
        <div
          class="divide-y divide-surface-200/40 dark:divide-surface-700/65 [&>*]:py-3"
        >
          <section class="px-3"><h4 class="text-xs mb-2">Go to</h4></section>
          <section class="px-3">
            <h4 class="text-xs mb-2">Actions</h4>
            <div class="">
              <div v-for="setting in settings" :key="setting.name">
                <div class="flex justify-between items-center">
                  <p
                    class="text-sm font-heading font-medium text-surface-500 dark:text-surface-150 flex items-center gap-2"
                  >
                    <span
                      :class="setting.icon"
                      class="text-surface-400 dark:text-surface-250/50"
                    ></span>
                    {{ setting.name }}
                  </p>
                  <component
                    :is="setting.component"
                    v-bind="setting.componentProps"
                  />
                </div>
              </div>
            </div>
          </section>
          <section class="px-3"><h4 class="text-xs mb-2">Other</h4></section>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import ColorModeSelector from "@/components/utils/color-mode-selector.vue";
import LanguageSelector from "@/components/utils/forms/dropdown/i18n-dropdown.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:visible"]);

const router = useRouter();

const isVisible = ref(props.visible);
const selectedCommand = ref(null);
const filteredCommands = ref([]);

watch(
  () => props.visible,
  (newValue) => {
    isVisible.value = newValue;
  }
);

watch(isVisible, (newValue) => {
  emit("update:visible", newValue);
});

const commands = [
  { label: "Go to Home", value: "home", action: () => router.push("/") },
  { label: "Go to About", value: "about", action: () => router.push("/") },
  {
    label: "Go to Contact",
    value: "contact",
    action: () => router.push("/contact"),
  },
  {
    label: "Toggle Dark Mode",
    value: "dark-mode",
    action: () => console.log("Toggle dark mode"),
  },
  { label: "Log Out", value: "logout", action: () => console.log("Log out") },
];

const searchCommands = (event: any) => {
  const query = event.query.toLowerCase();
  filteredCommands.value = commands.filter(
    (command) =>
      command.label.toLowerCase().includes(query) ||
      command.value.toLowerCase().includes(query)
  );
};

const executeCommand = (event: any) => {
  const command = commands.find((cmd) => cmd.value === event.value.value);
  if (command) {
    command.action();
    isVisible.value = false;
    selectedCommand.value = null;
  }
};

const settings = shallowRef([
  {
    name: "Dark mode",
    icon: "pi pi-moon",
    component: ColorModeSelector,
    componentProps: {
      type: "switch",
    },
  },
  // {
  //   name: "Language",
  //   component: LanguageSelector,
  // },
]);
</script>
