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
      class="bg-white text-surface-900 dark:bg-surface-900 dark:text-surface-50 transition"
    >
      <div>
        <DashboardSidebar />
        <div class="lg:pl-56">
          <main class="min-h-screen">
            <div class="pb-8">
              <Breadcrumbs
                class="hidden lg:block py-5 border-b border-surface-100 dark:border-surface-800"
              />
              <DashboardSubNavigation />
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

<script setup lang="ts">
const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: "id",
  addSeoAttributes: true,
});

const { showToast } = useToastService();
const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const title = computed(() =>
  t("layouts.default.title", {
    title: t((route.meta.title as string) ?? "TBD"),
  })
);

onErrorCaptured((error, instance, info) => {
  showToast({
    severity: "error",
    summary: t("error"),
    detail: error.message,
  });

  // Return false to prevent the error from propagating further
  return false;
});
</script>
