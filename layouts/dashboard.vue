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
                        <Breadcrumbs class="hidden sm:block mb-3" :pt="{
                            root: [
                                'rounded-md',
                                'py-2 pr-4 pl-1',
                                'overflow-x-auto'],
                            separator: [
                                'flex items-center',
                                'mx-1 scale-75',
                                'text-surface-500 dark:text-surface-200/50'
                            ],
                        }" />
                        <div v-auto-animate>
                            <Menubar v-if="showMenubar" :model="currentSubNavigation" class="mb-6" :pt="{
                                root: [
                                    'relative',
                                    'flex',
                                    'items-center',
                                    'p-1',
                                    'rounded-md',
                                    'bg-surface-0/80 dark:bg-surface-800/30',
                                    'border border-surface-100/50 dark:border-surface-700/50'
                                ],
                                menu: ({ props }) => ([
                                    'sm:flex',
                                    'items-center',
                                    'flex-wrap',
                                    'flex-col sm:flex-row',
                                    { hidden: !props?.mobileActive, flex: props?.mobileActive },
                                    'absolute sm:relative',
                                    'top-full left-0',
                                    'sm:top-auto sm:left-auto',
                                    'w-full sm:w-auto',
                                    'm-0',
                                    'py-1 sm:py-0 sm:p-0',
                                    'list-none',
                                    'shadow-md sm:shadow-none',
                                    'border-0',
                                    'bg-surface-0 dark:bg-surface-900 sm:bg-transparent dark:sm:bg-transparent',
                                    'outline-none'
                                ]),
                                content: ({ props }) => ([
                                    { 'rounded-md': props.root },
                                    'transition-all',
                                    'duration-200'
                                ]),
                                submenu: ({ props }) => ([
                                    'w-full sm:w-48',
                                    'py-0',
                                    'm-0',
                                    'list-none',
                                    'shadow-none sm:shadow-md',
                                    'border-0',
                                    'rounded-md',
                                    'static sm:absolute',
                                    'z-10',
                                    { 'sm:absolute sm:left-full sm:top-0': props.level > 1 },
                                    'bg-surface-0 dark:bg-surface-900 dark:sm:bg-surface-800'
                                ])
                            }" />
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
    const searchNavItems = (items, path) => {
        for (const item of items) {
            if (item.checkRoute === path || path.startsWith(item.checkRoute + '/') || item.route === path || path.startsWith(item.route + '/')) {
                return item.items ?? [];
            }
            if (item.items) {
                const subItems = searchNavItems(item.items, path);
                if (subItems) return subItems;
            }
        }
        return null;
    };

    let items = searchNavItems([...dashboardNavigation.value, ...dashboardSubNavigation.value], route.path);
    return items ?? [];
});

const showMenubar = computed(() => currentSubNavigation.value && currentSubNavigation.value.length > 0);
</script>

<style lang="scss" scoped></style>