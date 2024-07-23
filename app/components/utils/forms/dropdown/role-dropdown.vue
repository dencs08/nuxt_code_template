<template>
    <Select :modelValue="selectedRole" @update:modelValue="updateRole" :options="mutableRoles" optionLabel="label"
        optionValue="value">
        <template #option="slotProps">
            <Tag :value="slotProps.option.label" :severity="getRoleSeverity(slotProps.option.value)" />
        </template>
    </Select>
</template>

<script setup lang="ts">
const props = defineProps({
    modelValue: Object as () => Role | null
});

const { roles, getRoleSeverity } = useRoles();
const emit = defineEmits(['update:modelValue']);

const selectedRole = ref<Role | null>(props.modelValue);
const mutableRoles = computed(() => [...roles.value]);

const updateRole = (newRole: Role) => {
    selectedRole.value = newRole;
    emit('update:modelValue', newRole);
};
</script>