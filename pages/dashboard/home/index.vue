<template>
    <div class="flex flex-col lg:flex-row gap-8">
        <div class="w-full lg:w-4/6 space-y-8">
            <div class="space-y-2">
                <h2 class="text-db-h2">Main information</h2>
                <div class="flex gap-4 flex-wrap justify-center">
<!--                    <NuxtLink v-for="element in information" class="flex flex-col flex-grow w-1/2 sm:w-1/3 xl:w-1/4"-->
<!--                        :to="element.link">-->
<!--                        <Stat :label="element.label" :icon="element.icon" :value="element.value" :change="element.change"-->
<!--                            :changeType="element.changeType" :loading="loading"></Stat>-->
<!--                    </NuxtLink>-->
                </div>
            </div>

<!--            <TableApplicants :recent="true" />-->
          <div class="space-y-2">
            <h2 class="text-db-h2">Quick Actions</h2>
            <HorizontalScroller :breakpoint="768">
              <div class="flex gap-3 md:flex-wrap md:justify-center">
                <NuxtLink v-for="action in quickActions" :to="action.link" class="flex-none md:flex-grow md:w-1/3 xl:w-1/4">
                  <Card class="flex flex-col md:flex-row items-center gap-2 text-white transition-colors" :styling="action.color">
                    <Icon :name="action.icon" class="h-6 w-auto"/>
                    <p class="text-sm md:text-base">{{ action.title }}</p>
                  </Card>
                </NuxtLink>
              </div>
            </HorizontalScroller>
          </div>
        </div>

        <div class="w-full lg:w-1/3">
            <h2 class="text-db-h2">Actions</h2>
            <Card class="w-full">
<!--                <Feed />-->
            </Card>
        </div>
    </div>
</template>
<script setup>
definePageMeta({
    layout: "dashboard",
});

const loading = ref(true);

const information = ref([{
    label: "Opened recruitments",
    icon: "ic:round-supervisor-account",
    // link: "DashboardSettings",
}, {
    label: "Candidates applied",
    icon: "ic:round-supervisor-account",
    // link: "DashboardSettings",
}])

onMounted(async () => {
    // await fetchRecruitments();
    // await fetchApplicants();

    information.value = [
        {
            label: "Opened recruitments",
            icon: "ic:round-supervisor-account",
            // value: recruitments.value.length,
            // change: recruitments.value.length,
            changeType: 'increase',
            // link: "DashboardRecruitments",
        },
        {
            label: "Candidates applied",
            icon: "ic:round-supervisor-account",
            // value: applicants.value.length,
            // change: applicants.value.length,
            changeType: 'increase',
            // link: "DashboardApplicants",
        },
        // {
        //     label: "Quizes completed",
        //     icon: "ic:round-supervisor-account",
        //     value: 12,
        //     change: 4,
        //     changeType: 'decrease',
        //     link: "DashboardSettings",
        // },
    ]

    loading.value = false;
})

const quickActions = [
    {
        title: "Add new user",
        icon: "ic:round-person-add",
        color: "bg-primary-400 hover:bg-primary-500"
        // link: "#",
    },
    {
        title: "Send emails",
        icon: "ic:round-mail",
        color: "bg-secondary-700 hover:bg-secondary-800"
        // link: "#",
    },
    {
        title: "Generate a report",
        icon: "ic:sharp-data-exploration",
        color: "bg-primary-400 hover:bg-primary-500"
        // link: "#",
    }
]
</script>