<template>
  <Select
    :modelValue="selectedRole"
    @update:modelValue="updateRole"
    :options="mutableRoles"
    optionLabel="name"
    optionValue="name"
  >
    <template #option="slotProps">
      <Tag
        :value="slotProps.option.name"
        :severity="getRoleSeverity(slotProps.option.name)"
      />
    </template>
  </Select>
</template>

<script setup lang="ts">
import type { Role } from "~~/types/roles";
const props = defineProps({
  modelValue: Object as () => Role | null,
});

const rolesStore = useRolesStore();
const { getRoleSeverity } = rolesStore;
const { roles } = storeToRefs(rolesStore);

const emit = defineEmits(["update:modelValue"]);

const selectedRole = ref<Role | null>(props.modelValue);
const mutableRoles = computed(() => [...roles.value]);

const updateRole = (newRole: Role) => {
  selectedRole.value = newRole;
  emit("update:modelValue", newRole);
};
</script>
