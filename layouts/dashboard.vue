<template>
    <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">

    <Head>
        <Title>{{ title }}</Title>
        <template v-for="link in head.link" :key="link.id">
            <Link :id="link.id" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
        </template>
        <template v-for="meta in head.meta" :key="meta.id">
            <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
        </template>
    </Head>

    <Body class="bg-gray-50 text-surface-900 dark:bg-surface-900 dark:text-surface-50">
        <div>
            <DashboardSidebar />
            <div class="lg:pl-56">
                <main class="pt-20 min-h-screen">
                    <div class="px-4 sm:px-6 lg:px-8 pb-8">
                        <Breadcrumbs class="mb-2" />
                        <TabMenu v-if="currentSubNavigation" :model="currentSubNavigation.tabMenuItems" class="mb-7" />
                        <slot></slot>
                    </div>
                </main>
            </div>
        </div>
    </Body>

    </Html>
</template>

<script setup>
const route = useRoute()
const { t } = useI18n()
const head = useLocaleHead({
    addDirAttribute: true,
    identifierAttribute: 'id',
    addSeoAttributes: true
})
const title = computed(() => t('layouts.default.title', { title: t(route.meta.title ?? 'TBD') }))

const userStore = useUsersStore();
if (!userStore.userSession) {
    await userStore.fetchUserSession();
}

const { errorHandler } = useErrorHandler();
errorHandler();

const { dashboardSubNavigation } = useNavigation();
const { locale } = useI18n();

const removeLocalePrefix = (path, currentLocale) => {
    const localePrefixPattern = new RegExp(`^/${currentLocale}`);
    return path.replace(localePrefixPattern, '');
};

const currentSubNavigation = computed(() => {
    const pathWithoutLocale = removeLocalePrefix(route.path, locale.value);
    return dashboardSubNavigation.value.find(subNav => pathWithoutLocale.startsWith(`/dashboard${subNav.path}`))
});
</script>

<style lang="scss" scoped></style>