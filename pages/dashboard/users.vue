<script setup>
// import { UserRole } from '@/utils/UserRoles.ts';
import { useUsersStore } from "~/stores/UsersStore";
const userStore = useUsersStore();
const selectedProduct = ref();

definePageMeta({
  layout: "dashboard",
});

onMounted(async () => {
  await userStore.fetchUsers();
  // console.log(toRaw(userStore.users[0]));
})

const createUser = async () => {
  const userPayload = {
    email: 'test@test.pl',
    first_name: 'first name test',
    last_name: 'lastName',
    photo: 'avatar_url'
  };

  const { data, error } = await client
    .from('users')
    .insert([userPayload]);
  if (error) {
    console.error('Error inserting records:', error);
  } else {
    console.log('Inserted records:', data);
  }
}
</script>

<template>
  <div>
    <!--        <div v-if="loading">-->
    <!--            <AnimatedPlaceholder class="h-6 w-full rounded" />-->
    <!--        </div>-->

    <!--        <div v-else-if="user.role === UserRole.ADMIN">-->
    <!--            <UserCreator class="mb-3" />-->
    <!--            <TableUsers />-->
    <!--        </div>-->

    <!--        <div v-else-if="user.role === UserRole.RECRUITER">-->
    <!--            <TableUsers />-->
    <!--        </div>-->

    <!--        <div v-else-if="user.role === UserRole.SUBSCRIBER">-->
    <!--            <TableUsers />-->
    <!--        </div>-->

    <!--        <div v-else>-->
    <!--            You cannot view this resource.-->
    <!--        </div>-->

    <DataTable :value="userStore.users" v-model:selection="selectedProduct" dataKey="id" :loading="userStore.loading"
      removableSort tableStyle="min-width: 50rem">
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="name" header="Name" :sortable="true" style="width: 20%"></Column>
      <Column field="email" header="Email" :sortable="true" style="width: 20%"></Column>
      <Column field="phone" header="Phone" :sortable="true" style="width: 20%"></Column>
      <Column field="created_at" header="Created at" :sortable="true" style="width: 20%"></Column>
      <Column field="role" header="Role" :sortable="true" style="width: 20%"></Column>
    </DataTable>

    <!-- <Button @click="createUser">Create test user</Button> -->
    <!-- <Button @click="updateUser">Update user</Button> -->

    <TestComponent />
  </div>
</template>