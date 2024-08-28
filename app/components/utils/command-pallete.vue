<template>
  <Dialog v-model:visible="isVisible" modal :dismissableMask="true">
    <template #container="{ closeCallback }">
      <div class="flex flex-col px-3 py-3 gap-6 rounded-2xl">
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
            class="w-full"
          />
          <Button
            icon="pi pi-times"
            @click="closeCallback"
            text
            size="small"
          ></Button>
        </div>
        <div>other</div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

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
  { label: "Go to About", value: "about", action: () => router.push("/about") },
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
</script>
