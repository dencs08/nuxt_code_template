<template>
  <div>
    <section
      class="container mx-auto py-32 grid place-content-center text-center"
    >
      <h1 v-motion="slideTop({ delay: 400, useOpacity: true })">
        {{ t("index.content.hero.h1") }}
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

    <section>
      <DatePicker></DatePicker>
    </section>

    <section class="container mx-auto">
      <div class="flex flex-col text-center items-center gap-5 justify-between">
        <div>
          <CommonLink to="/home">Home</CommonLink>
          <CommonLink to="https://example.com" external underline
            >External Link</CommonLink
          >
          <CommonLink to="/about" variant="primary" size="lg" bold
            >About Us</CommonLink
          >
          <CommonLink to="/contact" disabled>Contact (Disabled)</CommonLink>
          <CommonLink to="/services" variant="secondary">
            <template #icon-left>
              <Icon name="ic:baseline-add-circle-outline" class="w-6 h-6" />
            </template>
            Our Services
          </CommonLink>
        </div>
        <CommonButton>button</CommonButton>
        <div>
          <CommonTextEmphasis>Default emphasis</CommonTextEmphasis>
          <CommonTextEmphasis variant="secondary" size="lg"
            >Large secondary emphasis</CommonTextEmphasis
          >
          <CommonTextEmphasis variant="accent" uppercase
            >Uppercase accent emphasis</CommonTextEmphasis
          >
          <CommonTextEmphasis tag="p" customClass="my-custom-class"
            >Custom paragraph emphasis</CommonTextEmphasis
          >
        </div>
        <CommonTextMuted>text muted</CommonTextMuted>
      </div>

      <div>
        <CommonTextMuted>Default muted text</CommonTextMuted>
        <CommonTextMuted intensity="light" size="lg"
          >Large light muted text</CommonTextMuted
        >
        <CommonTextMuted intensity="dark" italic
          >Dark italic muted text</CommonTextMuted
        >
        <CommonTextMuted tag="p" customClass="my-custom-class"
          >Custom paragraph muted text</CommonTextMuted
        >
      </div>

      <div>
        <CommonButton @click="handleClick">Click me</CommonButton>
        <CommonButton
          variant="secondary"
          size="lg"
          :loading="isLoading"
          @click="handleAsyncClick"
        >
          Async Action
        </CommonButton>
        <CommonButton variant="outline" block>Full Width</CommonButton>
        <CommonButton variant="text" disabled
          >Disabled Text Button</CommonButton
        >
        <CommonButton>
          <template #icon-left>
            <Icon name="ic:baseline-add-circle-outline" class="w-6 h-6" />
          </template>
          With Icon
        </CommonButton>
      </div>
    </section>

    <section>
      <AnimejsTest></AnimejsTest>
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
        <div class="h-64 bg-gray-0 rounded-xl">
          <MarqueeBase
            :clone="true"
            :duration="5"
            :gradient="true"
            :gradient-color="[250, 250, 250]"
            gradient-length="25%"
            :vertical="true"
            :pause-on-hover="true"
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

const title = computed(() => t("index.meta.title"));
const description = computed(() => t("index.meta.description"));
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

const { slideTop, slideLeft, slideRight, fade, slideBottom, pop } = useMotion();
const heroH2Words = computed(() => t("index.content.hero.h2").split(" "));
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

const isLoading = ref(false);

const handleClick = () => {
  console.log("Button clicked");
};

const handleAsyncClick = async () => {
  isLoading.value = true;
  await someAsyncOperation();
  isLoading.value = false;
};

const someAsyncOperation = () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
};
</script>
