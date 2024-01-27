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
                        <Breadcrumbs class="mb-3" />
                        <div v-auto-animate>
                            <Menubar v-if="showMenubar" :model="currentSubNavigation" class="mb-6" />
                        </div>
                        <slot></slot>
                    </div>
                </main>
            </div>
        </div>
    </Body>

    </Html>
</template>

<script setup>
const head = useLocaleHead({
    addDirAttribute: true,
    identifierAttribute: 'id',
    addSeoAttributes: true
})

const { locale, t } = useI18n();
const route = useRoute()
const title = computed(() => t('layouts.default.title', { title: t(route.meta.title ?? 'TBD') }))
const { dashboardSubNavigation, dashboardNavigation } = useNavigation();
const { errorHandler } = useErrorHandler();
errorHandler();

const currentSubNavigation = computed(() => {
    // Recursive function to search in navigation items
    const searchNavItems = (items, path) => {
        for (const item of items) {
            // Check for direct match or sub-route match
            if (item.route === path || path.startsWith(item.route + '/')) {
                return item.items ?? [];
            }
            // Recursively check in nested items
            if (item.items) {
                const subItems = searchNavItems(item.items, path);
                if (subItems) return subItems;
            }
        }
        return null;
    };

    // Search in dashboardNavigation and dashboardSubNavigation
    let items = searchNavItems([...dashboardNavigation.value, ...dashboardSubNavigation.value], route.path);
    return items ?? [];
});

// Control visibility of Menubar
const showMenubar = computed(() => currentSubNavigation.value && currentSubNavigation.value.length > 0);
</script>

<style lang="scss" scoped></style>