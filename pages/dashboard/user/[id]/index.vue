<template>
    <div>
        <div class="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div>
                <AnimatedPlaceholder v-if="loading" class="h-6 w-24 rounded" />
                <h2 v-else class="text-base font-semibold leading-7 text-gray-900">{{ user.name }}</h2>
                <p class="mt-1 text-sm leading-6 text-gray-500">Profile page</p>

                <dl class="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                    <div v-if="loading" class="space-y-5">
                        <AnimatedPlaceholder class="h-10 w-3/5" />
                        <AnimatedPlaceholder class="h-10 w-3/5" />
                        <AnimatedPlaceholder class="h-10 w-3/5" />
                    </div>
                    <div v-else v-for="(value, key) in user" :key="key" class="pt-6 sm:flex">
                        <dt class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{{ key }}
                        </dt>
                        <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                            <div class="text-gray-900">{{ value }}</div>
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    </div>
</template>
<script setup>
definePageMeta({
    layout: "dashboard",
});

const route = useRoute()
const { id } = route.params;

const { user, fetchUser } = useUsers();
const loading = ref(true);
onMounted(async () => {
    await fetchUser(id);
    loading.value = false;
})
</script>