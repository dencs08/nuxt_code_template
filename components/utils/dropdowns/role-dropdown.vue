<template>
    <Dropdown :modelValue="selectedRole" @update:modelValue="updateRole" :options="roles" optionLabel="label"
        optionValue="value">
        <template #option="slotProps">
            <Tag :value="slotProps.option.label" :severity="getRoleSeverity(slotProps.option.value)" />
        </template>
    </Dropdown>
</template>
  
<script setup>
const props = defineProps({
    modelValue: String
});


const { roles, getRoleSeverity } = useRoles();
const emit = defineEmits(['update:modelValue']);

const selectedRole = ref(props.modelValue);

const updateRole = (newRole) => {
    selectedRole.value = newRole;
    emit('update:modelValue', newRole);
};
</script>