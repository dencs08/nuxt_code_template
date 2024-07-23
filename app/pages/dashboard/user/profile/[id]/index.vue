<template>
    <div>
        <div class="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div>
                <h2 class="text-base font-semibold leading-7 text-surface-700 dark:text-surface-100">Profile</h2>
                <p class="mt-1 text-sm leading-6 text-surface-500 dark:text-surface-200">Lorem ipsum</p>

                <dl class="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                    <div v-for="(value, key) in user" :key="key" class="pt-6 sm:flex">
                        <dt class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{{ key }}
                        </dt>
                        <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                            <div class="text-gray-900">{{ value }}</div>
                            <!-- <button class="font-semibold text-primary-600 hover:text-primary-500">Update</button> -->
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
//TODO fix [id] in path when path doesnt exist, also propably create different naming convention for public profile pages
definePageMeta({
    layout: "dashboard",
});

const userStore = useUsersStore();
const user = userStore.getUser;
</script>