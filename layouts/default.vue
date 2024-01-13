<script setup>
const route = useRoute()
const { t } = useI18n()
const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true
})
const title = computed(() => t('layouts.default.title', { title: t(route.meta.title ?? 'TBD') }))
</script>

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

  <Body class="bg-gray-50 text-gray-900">
    <Navbar />
    <main>
      <slot />
    </main>
    <Footer />
  </Body>

  </Html>
</template>