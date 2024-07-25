<template>
  <div>
    <div class="flex flex-col lg:flex-row gap-8">
      <div class="w-full lg:w-4/6 space-y-8">
        <div class="space-y-2">
          <h5>Hi, {{ user?.email }}</h5>
          <h2 class="text-db-h2">Main information</h2>
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
                <Card
                  class="no-content border dark:border-surface-700 transition-colors p-5"
                  :pt="{
                    root: [
                      'rounded-md shadow-md bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-0',
                    ],
                  }"
                >
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
        <Card
          class="w-full border dark:border-surface-700"
          :pt="{
            root: [
              'rounded-md shadow-md bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-0',
            ],
          }"
        >
          <template #title>
            <h2 class="text-db-h2">Feed</h2>
          </template>
          <template #content>
            <ScrollPanel
              style="width: 100%; height: 200px"
              :pt="{
                bary: 'relative z-20 w-[9px] top-0 rounded-full bg-surface-200/40 dark:bg-surface-700 hover:bg-primary-500/25 hover:dark:bg-surface-600 cursor-pointer transition-colors',
              }"
            >
              <p>
                <!--                <Feed />-->
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Perferendis sed labore recusandae aspernatur, saepe, ab ut
                dolores nihil esse doloremque animi omnis quos fugiat? Quos quod
                at officiis hic accusamus? Lorem ipsum dolor sit, amet
                consectetur adipisicing elit. Eaque sit quis sed vero blanditiis
                beatae! Accusantium officiis laborum omnis molestias itaque,
                incidunt aperiam, quibusdam dignissimos voluptate exercitationem
                voluptatem iste iusto? Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Eveniet minima earum tempore magnam, facilis
                saepe molestias temporibus cupiditate, eius ratione illo
                voluptatem amet expedita aut, pariatur dignissimos eos ex
                debitis? Lorem ipsum dolor sit amet, consectetur adipisicing
                elit. Necessitatibus dicta ad dolorem possimus eum. Esse
                reprehenderit porro doloremque qui consectetur ducimus
                laboriosam, totam corporis odit impedit veritatis quidem,
                consequuntur ex.
              </p>
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
</script>
