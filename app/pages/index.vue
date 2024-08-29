<template>
  <div>
    <section
      class="container mx-auto py-32 grid place-content-center text-center"
    >
      <h1 v-motion="slideTop({ delay: 400, useOpacity: true })">
        {{ t("pages.index.content.hero.h1") }}
      </h1>
      <h2
        class="font-body text-3xl font-bold flex flex-row gap-2 justify-center overflow-hidden"
      >
        <div
          v-for="(word, index) in heroH2Words"
          :key="index"
          class="text-2xl"
          v-motion="
            slideBottom({
              delay: 350,
              index: index,
              interval: 50,
            })
          "
        >
          {{ word }}
        </div>
      </h2>
      <h3
        v-motion="
          slideTop({
            duration: 1000,
            repeat: true,
            repeatType: 'mirror',
            ease: 'easeInOut',
            y: 15,
            type: 'keyframes',
          })
        "
      >
        This is a test
      </h3>
    </section>

    <section class="container mx-auto space-y-12">
      <div>
        <h3>Test nuxt-img</h3>
        <div class="size-full sm:size-64 md:size-80 lg:size-96">
          <CustomNuxtImg
            v-motion="fade({ delay: 125, visible: true })"
          ></CustomNuxtImg>
        </div>
      </div>
      <div>
        <h3>Text vert + hover</h3>
        <div class="h-64 bg-gray-100 rounded-xl">
          <MarqueeBase
            :clone="true"
            :duration="5"
            :gradient="true"
            :gradient-color="[250, 250, 250]"
            gradient-length="25%"
            :vertical="true"
          >
            <div v-for="el in helloArraySmall" class="my-3 pl-3">
              <div class="font-medium text-3xl">{{ el }}</div>
            </div>
          </MarqueeBase>
        </div>
      </div>

      <div>
        <h3>Images</h3>
        <MarqueeBase :pause-on-hover="true" :pause-on-click="true">
          <div v-for="el in imgArray" class="size-64 mx-4">
            <custom-nuxt-img />
          </div>
        </MarqueeBase>
      </div>
    </section>

    <section class="container mx-auto">
      <DesignTableDisplay />
    </section>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();
const route = useRoute();
const business = useBusiness();

const title = computed(() => t("pages.index.meta.title"));
const description = computed(() => t("pages.index.meta.description"));

const url = business.url.value + route.fullPath;

useHead({
  title: title,
  link: [{ rel: "canonical", href: url }],
  meta: [
    { name: "description", content: description },
    { name: "og:description", content: description },
    { name: "og:title", content: title },
    { name: "og:type", content: "website" },
    { name: "og:locale", content: locale },
    // { property: 'og:url', content: 'https://nuxt.com' },
    // { property: 'og:image', content: 'https://nuxt.com/social.jpg' },
  ],
});
const date = ref(new Date(2023, 10, 28));

const { slideTop, slideLeft, slideRight, fade, slideBottom, pop } = useMotion();

const heroH2Words = computed(() => t("pages.index.content.hero.h2").split(" "));

const helloArraySmall = [
  "hello",
  "こんにちは",
  "bonjour",
  "hej",
  "hola",
  "ciao",
];

const imgArray = ref([
  {
    img: `/img/placeholder.jpg`,
  },
  {
    img: `/img/placeholder.jpg`,
  },
  {
    img: `/img/placeholder.jpg`,
  },
  {
    img: `/img/placeholder.jpg`,
  },
  {
    img: `/img/placeholder.jpg`,
  },
  {
    img: `/img/placeholder.jpg`,
  },
]);
const parentValue = ref("");
</script>
