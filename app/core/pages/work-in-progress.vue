<template>
  <div class="bg-white h-screen flex flex-col">
    <div
      class="mx-auto w-full max-w-7xl px-6 pb-16 pt-10 sm:pb-24 lg:px-8 flex-1 flex flex-col justify-center items-center"
    >
      <Logo color="black" type="typelogo" class="w-full h-8" />
      <div class="mx-auto mt-12 max-w-2xl text-center sm:mt-16">
        <h1
          class="mt-4 text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl"
        >
          {{ t("workInProgress.title") }}
        </h1>
        <p
          class="mt-4 text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8"
        >
          {{ t("workInProgress.description") }}
        </p>
      </div>
      <div class="mx-auto mt-10 flow-root max-w-lg sm:mt-10">
        <div>
          <div class="flex flex-row gap-3 md:gap-5">
            <div v-for="item in socialMenu" :key="item.label">
              <a
                :href="item.href"
                class="text-gray-400 hover:text-primary-500 hover:scale-110 transition-all"
              >
                <span class="sr-only">{{ item.label }}</span>
                <Icon
                  :name="item.icon"
                  class="h-8 md:h-10 w-auto text-surface-300 hover:text-primary-400 hover:scale-105 transistion"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="border-t border-gray-100 py-6 sm:py-10">
      <div
        class="mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 px-6 sm:flex-row lg:px-8"
      >
        <p class="text-sm leading-7 text-gray-400">
          &copy; {{ currentYear }} {{ t("copyright") }}
        </p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const { supportEmail } = useBusiness();
import { social } from "~~/config/common/menus";
const localePath = useLocalePath();

definePageMeta({
  layout: "none",
});

const runtimeConfig = useRuntimeConfig();
if (runtimeConfig.public.APP_WORK_IN_PROGRESS_MODE === "false") {
  navigateTo(localePath("/"));
}

const socialMenu = computed(() =>
  social.map((item) => ({
    label: item.label,
    href: item.href,
    icon: item.icon,
  }))
);

const currentYear = computed(() => new Date().getFullYear());
</script>

<style></style>
