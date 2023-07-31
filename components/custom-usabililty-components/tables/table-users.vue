<template>
    <Card class="overflow-hidden">
        <div class="flex justify-between">
            <div class="flex-1">
                <h1 class="text-base font-semibold leading-6 text-gray-900">Users</h1>
                <p class="mt-2 text-sm text-gray-700">List of all users in the system</p>
            </div>
        </div>
        <TableCheckbox :elements="users" :defaultSortColumn="defaultSortColumn" :columns="columns"
            onOpenLink="DashboardUserIndex" :navigationKey="props.navigationKey" :loading="loading" />
    </Card>
</template>
<script setup>
const props = defineProps({
    id: String,
    recent: {
        type: Boolean,
        default: false
    },
    navigationKey: {
        type: String,
        default: "id"
    },
    applicantAmount: {
        type: Number,
        default: 10
    }
})
const columns = ['name', 'email', 'role', 'created_at'];
const editableColumns = [];
const defaultSortColumn = 'name';
const { users, fetchUsers } = useUsers();
const loading = ref(true);
onMounted(async () => {
    await fetchUsers();
    loading.value = false;
})
</script>