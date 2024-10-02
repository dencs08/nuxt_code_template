<template>
  <Card class="custom-card">
    <template #title>
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-db-h2">Feed</h2>
        <Button
          icon="pi pi-refresh"
          size="small"
          severity="secondary"
          @click="refreshEvents"
        />
      </div>
    </template>
    <template #content>
      <VirtualScroller
        :items="eventsStore.events"
        :itemSize="60"
        showLoader
        :delay="75"
        :loading="eventsStore.loading"
        lazy
        @lazy-load="onLazyLoad"
        style="width: 100%; height: 450px"
      >
        <template #item="slotProps">
          <div class="flex flex-row relative">
            <div class="icon-container">
              <div
                class="p-1 rounded-full bg-surface-200 border border-surface-400"
              ></div>
            </div>
            <div class="w-full">
              <TimelineItem
                v-if="slotProps.item"
                :item="slotProps.item"
                style="height: 60px"
              />
            </div>
          </div>
        </template>

        <template v-slot:loader="{ options }">
          <div
            :class="[
              'flex items-center p-2',
              { 'bg-surface-100 dark:bg-surface-700': options.odd },
            ]"
            style="height: 60px"
          >
            <Skeleton :width="options.even ? '60%' : '50%'" height="30px" />
          </div>
        </template>
      </VirtualScroller>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useUsersStore } from "~/auth/stores/UsersStore";
import { useEventsStore } from "~/core/stores/EventsStore";
import TimelineItem from "./timeline-item.vue";

const props = defineProps({
  limit: {
    type: Number,
    default: 15,
  },
});

const usersStore = useUsersStore();
const eventsStore = useEventsStore();

const refreshEvents = () => {
  eventsStore.resetEvents();
  eventsStore.fetchEvents({ offset: 0, limit: props.limit, force: true });
};

const onLazyLoad = async (event: any) => {
  eventsStore.loading = true;
  const { first, last } = event;
  await eventsStore.fetchEvents({
    offset: first,
    limit: last - first,
    force: true,
  });
  eventsStore.loading = false;
};

onMounted(() => {
  eventsStore.fetchEvents({ offset: 0, limit: props.limit, force: true });
});

const attemptedUserIds = new Set<number>();

const ensureUsersLoaded = async () => {
  const requiredUserIds = new Set<number>();
  eventsStore.events.forEach((event) => {
    if (!event || !event.metadata) return;

    if (event.metadata.action_by) {
      requiredUserIds.add(event.metadata.action_by);
    }
    if (event.metadata.action_on) {
      requiredUserIds.add(event.metadata.action_on);
    }
  });

  const missingUserIds = [...requiredUserIds].filter(
    (id) =>
      !usersStore.users.some((u) => u.id === id) && !attemptedUserIds.has(id)
  );

  if (missingUserIds.length > 0) {
    await usersStore.fetchUsers({
      force: true,
      userIds: missingUserIds.join(","),
    });

    // Add fetched user IDs to the attemptedUserIds set
    missingUserIds.forEach((id) => attemptedUserIds.add(id));
  }
};

watch(() => eventsStore.events, ensureUsersLoaded, { immediate: true });
</script>

<style scoped>
::v-deep(.p-timeline-event-opposite) {
  display: none;
}

.icon-container {
  position: relative;
  z-index: -100;
}

.icon-container::after {
  content: "";
  position: absolute;
  margin-top: 5px;
  height: 70%;
  top: 0.5rem;
  bottom: -0.5rem;
  left: 50%;
  width: 1px;
  background-color: #ccc; /* Adjust color as needed */
  transform: translateX(-50%);
  z-index: -100;
}
</style>
