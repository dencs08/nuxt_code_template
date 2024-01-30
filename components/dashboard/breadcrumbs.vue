<template>
  <Breadcrumb :home="home" :model="items">
    <template #item="{ item, props }">
      <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
        <a :href="href" v-bind="props.action" @click="navigate">
          <span :class="[item.icon, 'text-color']" />
          <span
            class="text-surface-700 dark:text-surface-100/70 font-light text-xs hover:text-primary-500 dark:hover:text-primary-500 transition">{{
              item.label
            }}</span>
        </a>
      </router-link>
      <a v-else :href="item.url" :target="item.target" v-bind="props.action">
        <span class="text-surface-700 dark:text-surface-0/80">{{ item.label }}</span>
      </a>
    </template>
  </Breadcrumb>
</template>

<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const { locale, getBrowserLocale } = useI18n()

const home = ref({
  icon: 'pi pi-home',
  route: localePath({ name: 'dash-home' })
});

const items = computed(() => {
  // Split the path into segments
  const segments = route.path.split('/').filter(segment => segment);

  // Remove the locale from the segments
  const localeIndex = segments.indexOf(locale.value as string);
  if (localeIndex !== -1) {
    segments.splice(localeIndex, 1);
  }

  // Build the items array
  return segments.map((segment, index) => {
    return {
      label: segment,
      route: localePath('/' + segments.slice(0, index + 1).join('/'))
    };
  });
});
</script>

