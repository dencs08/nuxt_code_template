<template>
  <div>
    <div
      class="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none"
    >
      <div>
        <div
          v-if="usersStore.loading"
          class="space-y-4 leading-6 text-blue-500"
        >
          <Skeleton width="100%" height="4rem"></Skeleton>
          <Skeleton width="100%" height="4rem"></Skeleton>
          <Skeleton width="100%" height="4rem"></Skeleton>
        </div>
        <div v-else-if="!userExists" class="leading-6 text-red-500">
          This user doesn't exist.
        </div>
        <div v-else>
          Profile
          <div>
            <dl
              class="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
            >
              <div v-for="(value, key) in user" :key="key" class="pt-6 sm:flex">
                <dt
                  class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6"
                >
                  {{ key }}
                </dt>
                <dd
                  class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto"
                >
                  <div class="text-gray-900">
                    {{ value }}
                  </div>
                  <!-- <button class="font-semibold text-primary-600 hover:text-primary-500">Update</button> -->
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

import { computed } from "vue";

interface RouteParams {
  id: string;
}

const route = useRoute();
const params = route.params as RouteParams;

const usersStore = useUsersStore();

const user = ref<any>(null);
onMounted(async () => {
  user.value = await usersStore.fetchUser(params.id);
});

const userExists = computed(() => {
  return user.value && Object.keys(user.value).length > 0;
});
</script>
