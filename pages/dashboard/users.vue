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
    </div>
</template>
<script setup>
// import { UserRole } from '@/utils/UserRoles.ts';

definePageMeta({
    layout: "dashboard",
});

// const { user, loading } = useUserSession();
// const { users, fetchUsers } = useUsers();
onMounted(async () => {
    // await fetchUsers();
})
</script>
