<script setup>
import { useUsersStore } from "~/stores/UsersStore";
const userStore = useUsersStore();
const { handleSubmit } = useSubmit();

const handleForm = async (data) => {
    await handleSubmit(userStore.updateUser, { data }, 'User updated');
};

const fetchForm = async () => {
    await handleSubmit(userStore.fetchUserSession, {}, 'User fetched');
};

const userSession = computed(() => userStore.getUserSession);
</script>

<template>
    <div>
        <FormWrapper :handleSubmit="handleForm" :submit-attrs="{ inputClass: 'btn-primary' }" submit-label="Update user">
        </FormWrapper>

        <FormWrapper :handleSubmit="fetchForm" :submit-attrs="{ inputClass: 'btn-primary' }" submit-label="fetch user">
        </FormWrapper>
    </div>
</template>