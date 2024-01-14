<template>
    <DataTable :value="userStore?.users" v-model:selection="selected" v-model:editingRows="editingRows"
        :loading="userStore?.loading" v-model:filters="filters" dataKey="id" tableStyle="min-width: 50rem;" removableSort
        editMode="row" @row-edit-save="onRowEditSave" paginator :rows="10"
        :globalFilterFields="['name', 'email', 'phone', 'role']" size="small">

        <template #header>
            <div class="flex justify-between items-center">
                <div v-if="hasAccess" class="flex gap-2 w-full items-center">
                    <UserCreator />
                    <Button label="Delete" severity="danger" @click="confirmDeleteUsers"
                        :disabled="!selected || !selected.length" />
                    <Button size="small" v-tooltip.top="'Save changes'" @click="confirmSaveChanges" icon="pi pi-save"
                        class="!p-2" :disabled="!changesMade" />
                </div>
                <div class="flex justify-between gap-3" :class="!hasAccess ? 'w-full' : ''">
                    <span class="relative">
                        <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search"
                            class="pl-10 font-normal" />
                    </span>
                    <div class="grid place-content-center">
                        <Button size="small" v-tooltip.left="'Refresh users table'" @click="fetchUsers"
                            class="pi pi-refresh text-surface-700 dark:text-surface-100" />
                    </div>
                </div>
            </div>
        </template>

        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column field="name" header="Name" :sortable="true" style="width: 15%">
            <template #editor="{ data, field }">
                <InputText size="small" v-model="data[field]" />
            </template>
        </Column>
        <Column field="email" header="Email" :sortable="true" style="width: 25%">
            <template #editor="{ data, field }">
                <InputText size="small" v-model="data[field]" />
            </template>
        </Column>
        <Column field="phone" header="Phone" :sortable="true" style="width: 20%">
            <template #editor="{ data, field }">
                <InputText size="small" v-model="data[field]" />
            </template>
        </Column>
        <Column field="created_at" header="Created at" :sortable="true" style="width: 20%"></Column>
        <Column field="role" header="Role" :sortable="true" style="width: 20%">
            <template #body="{ data }">
                <Tag v-if="data?.role" :value="data?.role" :severity="getRoleSeverity(data?.role)" />
            </template>
            <template #editor="{ data, field }">
                <RoleDropdown v-model="data[field]" />
            </template>
        </Column>
        <Column :rowEditor="true" style="width: 10%; min-width: 6rem" bodyStyle="text-align:center"></Column>
    </DataTable>
</template>
  
<script setup>
import { FilterMatchMode } from 'primevue/api';
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const { handleSubmit } = useSubmit();
const { getRoleSeverity } = useRoles();
const { hasAccess } = useRoleCheck('admin');
const userStore = useUsersStore();
userStore.fetchUsers();

const editingRows = ref([]);
const selected = ref();
const changesMade = ref(false);

const onRowEditSave = async (event) => {
    let { newData, index } = event;
    userStore.updateLocalUsers(index, newData);
    changesMade.value = true;
};

const fetchUsers = async () => {
    await handleSubmit(userStore.fetchUsers, {}, 'Users fetched');
    changesMade.value = false;
};

const updateUsers = async () => {
    for (let i = 0; i < userStore.users.length; i++) {
        const user = userStore.users[i];
        await userStore.updateUser(i, user);
        await userStore.updateRole(i, user);
    }
    changesMade.value = false;
    originalUsers.value = JSON.parse(JSON.stringify(userStore.users));
};

const originalUsers = ref(JSON.parse(JSON.stringify(userStore.users)));
const changes = computed(() => {
    return userStore.users
        .map((user, index) => {
            const originalUser = originalUsers.value[index];
            const changedValues = Object.entries(user)
                .filter(([key, value]) => originalUser[key] !== value)
                .map(([key, value]) => ({ key, oldValue: originalUser[key], newValue: value }))
                .filter(Boolean);
            return { userName: user.name, email: user.email, changes: changedValues };
        })
        .filter(user => user.changes.length > 0);
});

//TODO add a confirm dialog composable for easier use + toast after success / error
const { confirmAction } = useConfirmation();
const confirmDeleteUsers = (event) => {
    confirmAction(async () => {
        const selectedIds = selected.value.map(user => user.id);
        await handleSubmit(userStore.deleteUsers, selectedIds, 'Users deleted');
        selected.value = [];
    },
        { message: 'Delete this record(s)?', target: event.currentTarget, severity: 'danger', showToastOnAccept: false, showToastOnReject: false });
};

const confirmSaveChanges = () => {
    confirmAction(async () => {
        await updateUsers();
    },
        {
            message: changes,
            header: 'Do you want to save these changes?',
            severity: 'info',
            showToastOnAccept: true,
            showToastOnReject: false,
        }, "changes");
};

</script>