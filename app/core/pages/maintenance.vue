<template>
  <div class="bg-white h-screen flex flex-col">
    <div class="z-99">
      <div
        class="mx-auto w-full max-w-7xl px-6 pb-16 pt-10 sm:pb-16 lg:px-8 flex-1 flex flex-col justify-center items-center"
      >
        <Logo color="black" type="typelogo" class="w-full h-8" />
        <div class="mx-auto mt-12 max-w-2xl text-center sm:mt-12 z-10">
          <p class="text-base font-semibold leading-8 text-primary-500">
            {{ t("maintenance.description") }}
          </p>
          <h1
            class="mt-4 text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl"
          >
            {{ t("maintenance.title") }}
          </h1>
          <p
            class="mt-4 text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8"
          >
            {{ t("support.pleaseTryAgainLater") }}
          </p>
        </div>
        <div
          class="mx-auto mt-10 flex flex-col items-center justify-center gap-3 max-w-lg sm:mt-6 z-99"
        >
          <div>
            <CommonLink
              :to="`mailto:${supportEmail}`"
              class="flex items-center justify-center gap-2"
            >
              <Icon name="ic:outline-mail" class="w-auto h-5 text-xl" />
              <p>{{ t("support.contactUs") }}</p>
            </CommonLink>
          </div>
          <div class="flex flex-row gap-3 md:gap-3 z-99">
            <div v-for="item in socialMenu" :key="item.label">
              <a
                :href="item.href"
                class="text-primary-400 hover:text-primary-500 hover:scale-110 transition-all z-99"
              >
                <span class="sr-only">{{ item.label }}</span>
                <Icon
                  :name="item.icon"
                  class="h-8 md:h-8 w-auto text-primary-500 hover:text-primary-400 hover:scale-105 transistion z-99"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        class="w-full h-full object-cover absolute top-0 left-0 pointer-events-none select-none"
      >
        <CustomNuxtImg
          src="img/maintenance.webp"
          alt="Maintenance"
          format="webp"
          class="w-full h-full object-cover z-[-99]"
        />
      </div>
    </div>
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
if (runtimeConfig.public.APP_MAINTENANCE_MODE === "false") {
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
