<script setup>
const usersStore = useUsersStore();
const { handleSubmit } = useSubmit();

const updateUser = async (data) => {
  await handleSubmit(usersStore.updateUser, { data }, "User updated");
};

const fetchUserSession = async () => {
  // await handleSubmit(userStore.fetchUser, {}, "User fetched");
};

const fetchUsers = async () => {
  await handleSubmit(usersStore.fetchUsers, {}, "Users fetched");
};
</script>

<template>
  <div class="flex gap-4">
    <FormWrapper
      :handleSubmit="updateUser"
      :submit-attrs="{ inputClass: 'btn-primary' }"
      submit-label="Update user"
    >
    </FormWrapper>

    <FormWrapper
      :handleSubmit="fetchUserSession"
      :submit-attrs="{ inputClass: 'btn-primary' }"
      submit-label="fetch user"
    >
    </FormWrapper>

    <FormWrapper
      :handleSubmit="fetchUsers"
      :submit-attrs="{ inputClass: 'btn-primary' }"
      submit-label="fetch users"
    >
    </FormWrapper>
  </div>
</template>
