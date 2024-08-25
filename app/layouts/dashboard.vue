<template>
  <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
    <Head>
      <Title>{{ title }}</Title>
      <template v-for="link in head.link" :key="link.id">
        <Link
          :id="link.id"
          :rel="link.rel"
          :href="link.href"
          :hreflang="link.hreflang"
        />
      </template>
      <template v-for="meta in head.meta" :key="meta.id">
        <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
      </template>
    </Head>

    <Body
      class="bg-white text-surface-900 dark:bg-surface-900 dark:text-surface-50"
    >
      <div>
        <DashboardSidebar />
        <div class="lg:pl-56">
          <main class="min-h-screen">
            <div class="pb-8">
              <Breadcrumbs class="hidden lg:block py-5 border-b" />
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 -translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-1"
              >
                <div v-if="showMenubar">
                  <Menubar
                    :model="currentSubNavigation"
                    class="py-2"
                    :pt="{
                      root: [
                        'p-1',
                        'rounded-none',
                        'bg-transparent dark:bg-surface-transparent',
                        'border-b border-t-0 border-x-0 border-surface-100/50 dark:border-surface-700/50',
                      ],
                    }"
                  />
                </div>
              </Transition>
              <div class="px-4 sm:px-6 lg:px-4 mt-5">
                <slot></slot>
              </div>
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
  identifierAttribute: "id",
  addSeoAttributes: true,
});

const { locale, t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const title = computed(() =>
  t("layouts.default.title", { title: t(route.meta.title ?? "TBD") })
);
const { dashboardSubNavigation, dashboardNavigation } = useNavigation();
const { errorHandler } = useErrorHandler();
errorHandler();

// const userStore = useUserStore();
// await userStore.fetchUser();
// const userSession = userStore.getUser;
// if (!userSession) {
//   navigateTo(localePath({ name: "login" }));
// }

const currentSubNavigation = computed(() => {
  const searchNavItems = (items, path) => {
    for (const item of items) {
      if (
        item.checkRoute === path ||
        path.startsWith(item.checkRoute + "/") ||
        item.route === path ||
        path.startsWith(item.route + "/")
      ) {
        return item.items ?? [];
      }
      if (item.items) {
        const subItems = searchNavItems(item.items, path);
        if (subItems) return subItems;
      }
    }
    return null;
  };

  let items = searchNavItems(
    [...dashboardNavigation.value, ...dashboardSubNavigation.value],
    route.path
  );
  return items ?? [];
});

const showMenubar = computed(
  () => currentSubNavigation.value && currentSubNavigation.value.length > 0
);
</script>

<style lang="scss" scoped></style>
