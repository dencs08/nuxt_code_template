<template>
  <div>
    <UserPermissionDialog
      :isDialogVisible="isDialogVisible"
      :selectedUser="selectedUser"
      @update:isDialogVisible="isDialogVisible = $event"
    />
    <div class="rounded-lg overflow-hidden">
      <UsersTable @showPermissions="handleShowPermissions" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
const isDialogVisible = ref(false);
const selectedUser = ref(null);

const handleShowPermissions = async (user: any) => {
  selectedUser.value = user;
  isDialogVisible.value = true;
};
</script>
