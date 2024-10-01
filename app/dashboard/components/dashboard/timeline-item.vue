<template>
  <div class="flex flex-row justify-between px-2" style="height: 60px">
    <div>
      <p
        v-if="item.metadata && item.metadata.action_by"
        class="text-xs -mt-0.5"
      >
        <NuxtLink
          :to="localePath(`/dashboard/admin/users/${item.metadata.action_by}`)"
          class="text-primary-700 dark:text-primary-400 hover:underline"
        >
          {{ getUserName(item.metadata.action_by) }}
        </NuxtLink>
      </p>
      <div>
        <span class="text-sm"> {{ item.details }} {{ " " }} </span>
        <span v-if="item.metadata && item.metadata.action_on" class="text-xs">
          <NuxtLink
            :to="
              localePath(`/dashboard/admin/users/${item.metadata.action_on}`)
            "
            class="text-primary-500 hover:underline"
          >
            "{{ getUserName(item.metadata.action_on) }}"
          </NuxtLink>
        </span>
      </div>
    </div>
    <div class="text-right space-y-0.5">
      <Tag :severity="getActionSeverity(item.action)">
        <p class="text-[10px] text-surface-400 dark:text-surface-500">
          {{ item.title }}
        </p>
      </Tag>
      <div class="text-[11px] text-muted-color">
        {{ formatDate(item.created_at) }}
        {{ formatDate(item.created_at, { onlyTime: true }) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUsersStore } from "~/auth/stores/UsersStore";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const localePath = useLocalePath();
const { formatDate } = useDate();
const usersStore = useUsersStore();

const getUserName = (userId: number): string => {
  const user = usersStore.users.find((u) => u.id === userId);
  return user ? user.name : `Deleted user`;
};

const getActionSeverity = (action: string) => {
  switch (action.toUpperCase()) {
    case "CREATE":
      return "success";
    case "UPDATE":
      return "info";
    case "DELETE":
      return "danger";
    default:
      return "warning";
  }
};
</script>
