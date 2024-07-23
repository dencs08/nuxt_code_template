<template>
    <div>
        <div class="rounded-lg overflow-hidden">
            <UsersTable />

            <!-- <BaseTable :items="userStore?.users" :loading="userStore?.loading" :columns="columns"
                :globalFilterFields="['name', 'email', 'phone', 'role']" @row-edit-save="onRowEditSave"
                @save-changes="onSaveChanges" :editable="true" selectable="multiple" removableSort stripedRows paginator>

                <template #body-created_at="{ data }">
                    <span>{{ formatDate(data.created_at) }}</span>
                </template>

                <template #body-role="{ data }">
                    <Tag v-if="data?.role" :value="data?.role" :severity="getRoleSeverity(data?.role)" />
                </template>

                <template #editor-role="{ data }">
                    <RoleDropdown v-model="data.role" />
                </template>

            </BaseTable> -->
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "dashboard",
});

// const { handleSubmit } = useSubmit();
// const { getRoleSeverity } = useRoles();
// const { hasAccess } = useRoleCheck('admin');
// const userStore = useUsersStore();

// const originalUsers = ref([]);
// const changesMade = ref(false);

// const columns = [
//     { field: 'name', header: 'Name', sortable: true, editor: true },
//     { field: 'email', header: 'Email', sortable: true, editor: true },
//     { field: 'phone', header: 'Phone', sortable: true, editor: true },
//     { field: 'created_at', header: 'Created at', sortable: true, editor: false },
//     { field: 'role', header: 'Role', sortable: true, editor: true },
//     // Add more columns as needed
// ];

// onMounted(() => {
//     fetchUsers();
// })

// const fetchUsers = async () => {
//     await handleSubmit(userStore.fetchUsers, {}, 'Users fetched');
//     originalUsers.value = JSON.parse(JSON.stringify(userStore.users));
//     changesMade.value = false;
// };

// const onRowEditSave = async (event: any) => {
//     let { newData, index } = event;
//     userStore.updateLocalUsers(index, newData);
//     changesMade.value = true;
// };

// const onSaveChanges = async (changes: any) => {
//     // await updateUsers();
// };

// const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const seconds = String(date.getSeconds()).padStart(2, '0');

//     return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
// };
</script>
