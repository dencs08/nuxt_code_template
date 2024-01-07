<script setup>
// import { UserRole } from '@/utils/UserRoles.ts';
import { useUsersStore } from "~/stores/UsersStore";
const userStore = useUsersStore();
const selected = ref();

definePageMeta({
  layout: "dashboard",
});

onMounted(async () => {
  await userStore.fetchUsers();
  // console.log(toRaw(userStore.users[0]));
})

const confirm = useConfirm();
const confirm2 = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Do you want to delete this record?',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger p-button-sm',
    accept: () => {
      const selectedIds = selected.value.map(user => user.id);
      userStore.deleteUsers(selectedIds);
      selected.value = [];
    },
    reject: () => {
      selected.value = [];
    }
  });
};
</script>

<template>
  <div>
    <!--        <div v-else>-->
    <!--            You cannot view this resource.-->
    <!--        </div>-->
    <Toolbar class="mb-4">
      <template #start>
        <div class="flex gap-2">
          <UserCreator />
          <Button label="Delete" severity="danger" @click="confirm2" :disabled="!selected || !selected.length">
            Delete
          </Button>

        </div>
      </template>
      <template #end>
        <TestComponent />

        <!-- invite the user? -->
      </template>
    </Toolbar>
    <DataTable :value="userStore.users" v-model:selection="selected" dataKey="id" :loading="userStore.loading"
      removableSort tableStyle="min-width: 50rem">
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="name" header="Name" :sortable="true" style="width: 20%"></Column>
      <Column field="email" header="Email" :sortable="true" style="width: 20%"></Column>
      <Column field="phone" header="Phone" :sortable="true" style="width: 20%"></Column>
      <Column field="created_at" header="Created at" :sortable="true" style="width: 20%"></Column>
      <Column field="role" header="Role" :sortable="true" style="width: 20%"></Column>
    </DataTable>

    <div class="bg-primary-0 h-50 w-50">.</div>
    <div class="bg-primary-50 h-50 w-50">.</div>
    <div class="bg-primary-100 h-50 w-50">.</div>
    <div class="bg-primary-200 h-50 w-50">.</div>
    <div class="bg-primary-300 h-50 w-50">.</div>
    <div class="bg-primary-400 h-50 w-50">.</div>
    <div class="bg-primary-500 h-50 w-50">.</div>
    <div class="bg-primary-600 h-50 w-50">.</div>
    <div class="bg-primary-700 h-50 w-50">.</div>
    <div class="bg-primary-800 h-50 w-50">.</div>
    <div class="bg-primary-900 h-50 w-50">.</div>
    <div class="bg-primary-950 h-50 w-50">.</div>

    <div class="bg-secondary-0 h-50 w-50">.</div>
    <div class="bg-secondary-50 h-50 w-50">.</div>
    <div class="bg-secondary-100 h-50 w-50">.</div>
    <div class="bg-secondary-200 h-50 w-50">.</div>
    <div class="bg-secondary-300 h-50 w-50">.</div>
    <div class="bg-secondary-400 h-50 w-50">.</div>
    <div class="bg-secondary-500 h-50 w-50">.</div>
    <div class="bg-secondary-600 h-50 w-50">.</div>
    <div class="bg-secondary-700 h-50 w-50">.</div>
    <div class="bg-secondary-800 h-50 w-50">.</div>
    <div class="bg-secondary-900 h-50 w-50">.</div>
    <div class="bg-secondary-950 h-50 w-50">.</div>

  </div>
</template>