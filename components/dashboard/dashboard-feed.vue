<template>
    <ul role="list" class="space-y-6">
        <li v-if="loading" class="space-y-2">
            <div class="grid grid-cols-3 gap-3">
                <div class="col-span-2 space-y-2">
                    <AnimatedPlaceholder class="h-6 w-full rounded" />
                    <AnimatedPlaceholder class="h-6 w-full rounded col-span-2" />
                </div>
                <AnimatedPlaceholder class="h-6 w-full rounded" />
            </div>
        </li>
        <li v-if="feed?.length > 0 && !loading" v-for="( activityItem, activityItemIdx ) in  feed " :key="activityItem.id"
            class="relative flex gap-x-4">
            <div
                :class="[activityItemIdx === feed.length - 1 ? 'h-6' : '-bottom-6', 'absolute left-0 top-0 flex w-6 justify-center']">
                <div class="w-px bg-gray-200" />
            </div>
            <template v-if="activityItem.type === 'commented'">
                <div class="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50"></div>
                <div class="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
                    <div class="flex justify-between gap-x-4">
                        <div class="py-0.5 text-xs leading-5 text-gray-500">
                            <span class="font-medium text-gray-900">{{ activityItem.person.name }}</span> commented
                        </div>
                        <time :datetime="activityItem.dateTime" class="flex-none py-0.5 text-xs leading-5 text-gray-500">{{
                            activityItem.date }}</time>
                    </div>
                    <p class="text-sm leading-6 text-gray-500">{{ activityItem.comment }}</p>
                </div>
            </template>
            <template v-else>
                <div class="relative flex h-6 w-6 flex-none items-center justify-center">
                    <Icon v-if="activityItem.type === 'applied'" name="ic:round-check-circle"
                        class="h-6 w-6 text-primary-500" aria-hidden="true" />
                    <div v-else class="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                </div>
                <p class="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                    <span class="font-medium text-gray-900">
                        <p v-if="activityItem.user">
                            {{ activityItem.user.name }}
                        </p>
                        <NuxtLink v-else-if="activityItem.applicant" class="underline"
                            :to="{ name: 'DashboardCandidate', params: { id: activityItem.applicant.id } }">
                            {{ activityItem.applicant.name }}
                        </NuxtLink>
                        {{ activityItem.activity }}
                    </span>
                </p>
                <time :datetime="activityItem.dateTime" class="flex-none py-0.5 text-xs leading-5 text-gray-500">{{
                    activityItem.date }}</time>
            </template>
        </li>
        <p v-if="!loading && !feed" class="text-gray-500 text-sm">Nothing here for now</p>
    </ul>
</template>

<script setup>
const { fetchFeed, feed } = useFeed();
const loading = ref(true)
onMounted(async () => {
    await fetchFeed(10);
    loading.value = false;
})
</script>