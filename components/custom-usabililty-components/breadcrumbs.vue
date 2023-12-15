<template>
  <nav aria-label="breadcrumb">
    <ol class="flex flex-row items-center gap-1 text-gray-400 text-xs">
      <li class="capitalize" v-for="(crumb, index) in crumbs" :key="index">
        <nuxt-link :to="crumb.path" class="hover:text-primary-700 transition-color duration-75" :class="{ 'text-primary-500': index === crumbs.length - 1 }">{{ crumb.label }}</nuxt-link>
        <span v-if="index !== crumbs.length - 1" class="ml-1">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const { locale, getBrowserLocale } = useI18n()

const breadcrumbs = ref([])

const crumbs = computed(() => {
  // Fetch supported locales from i18n module
  const languageCodes = getBrowserLocale()

  const pathArray = route.path.split('/').filter(n => n)

  // If the first element of pathArray is a language code, remove it.
  if (languageCodes.includes(pathArray[0])) {
    pathArray.shift()
  }

  let breadcrumbs: any[] = []
  pathArray.forEach((path, index) => {
    let crumbPath = `/${pathArray.slice(0, index + 1).join('/')}`
    // if current locale is not default locale, prefix crumbPath with locale
    if (locale.value !== 'en') {
      crumbPath = `/${locale.value}${crumbPath}`
    }
    breadcrumbs.push({
      label: path,
      path: crumbPath
    })
  })
  return breadcrumbs
})
</script>

