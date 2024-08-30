<template>
  <div>
    <div class="flex flex-col lg:flex-row gap-8">
      <div class="w-full space-y-8">
        <div class="space-y-2">
          <h5>Hi, {{ user?.email }}</h5>
        </div>

        <div class="space-y-2">
          <h2 class="text-db-h2">Quick Actions</h2>
          <HorizontalScroller :breakpoint="768">
            <div class="flex gap-3 md:flex-wrap md:justify-center">
              <NuxtLink
                v-for="action in quickActions"
                :to="action.link"
                class="flex-none md:flex-grow md:w-1/3 xl:w-1/4"
              >
                <Card class="no-content p-5">
                  <template #header>
                    <div class="flex flex-col md:flex-row items-center gap-2">
                      <Icon
                        :name="action.icon"
                        class="h-6 w-auto transition-colors"
                        :class="action.color"
                      />
                      <p class="text-sm md:text-base">{{ action.title }}</p>
                    </div>
                  </template>
                </Card>
              </NuxtLink>
            </div>
          </HorizontalScroller>
        </div>
      </div>

      <div class="w-full lg:w-1/3">
        <Card>
          <template #title>
            <h2 class="text-db-h2">Feed</h2>
          </template>
          <template #content>
            <ScrollPanel>
              <Timeline :value="events">
                <template #opposite="slotProps">
                  <small class="text-surface-500 dark:text-surface-400">{{
                    slotProps.item.date
                  }}</small>
                </template>
                <template #content="slotProps">
                  {{ slotProps.item.status }}
                </template>
              </Timeline>
            </ScrollPanel>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

const userStore = useUserStore();
const user = userStore.getUser;

const quickActions = [
  {
    title: "Add new user",
    icon: "ic:round-person-add",
    color: "text-primary-500 hover:text-primary-700",
    link: "#",
  },
  {
    title: "Send emails",
    icon: "ic:round-mail",
    color: "text-secondary-500 hover:text-secondary-700",
    link: "#",
  },
  {
    title: "Generate a report",
    icon: "ic:sharp-data-exploration",
    color: "text-primary-500 hover:text-primary-700",
    link: "#",
  },
  {
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    icon: "ic:sharp-data-exploration",
    color: "text-secondary-500 hover:text-secondary-700",
    link: "#",
  },
];

const events = ref([
  {
    status: "Ordered",
    date: "15/10/2020 10:30",
    icon: "pi pi-shopping-cart",
    color: "#9C27B0",
  },
  {
    status: "Processing",
    date: "15/10/2020 14:00",
    icon: "pi pi-cog",
    color: "#673AB7",
  },
  {
    status: "Shipped",
    date: "15/10/2020 16:15",
    icon: "pi pi-shopping-cart",
    color: "#FF9800",
  },
  {
    status: "Delivered",
    date: "16/10/2020 10:00",
    icon: "pi pi-check",
    color: "#607D8B",
  },
]);
</script>
