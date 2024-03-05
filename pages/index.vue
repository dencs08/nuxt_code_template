<template>
  <div>
    <section class="container mx-auto min-h-screen grid place-content-center text-center">
      <h1 v-motion="slideTop({ delay: 400 })">
        {{ t('pages.index.title') }}
      </h1>
      <p class="font-body text-3xl font-bold" v-motion="fade({ delay: 425 })">
        {{ t('pages.index.description') }}
      </p>
      <p class="font-accent text-2xl" v-motion="slideBottom({ delay: 450 })">
        {{ $t('welcome') }}
      </p>
    </section>

    <section class="container mx-auto my-24 space-y-12">
      <div class="">
        <h3>Text</h3>
        <MarqueeBase :pause-on-hover="false" :pause-on-click="true" :vertical="false"
          class="bg-gray-100 p-6 rounded-xl">
          <div v-for="el in helloArray" class="mx-2">
            <div class="font-medium text-sm w-max">{{ el }}</div>
          </div>
        </MarqueeBase>
      </div>

      <div>
        <h3>Text vert</h3>
        <div class="h-32 overflow-hidden bg-gray-100 rounded-xl">
          <MarqueeBase :pause-on-hover="true" :pause-on-click="true" :vertical="true" class="p-6">
            <div v-for="el in helloArray" class="my-3">
              <div class="font-medium text-3xl w-max">{{ el }}</div>
            </div>
          </MarqueeBase>
        </div>
      </div>
      <!-- 

      <div class="">
        <h3>Small text</h3>
        <MarqueeBase :pause-on-hover="true" :pause-on-click="true" :vertical="false" :clone="true"
          class="bg-gray-100 p-6 rounded-xl">
          <div v-for="el in helloArraySmall" class="mx-6">
            <div class="font-medium text-5xl w-max">{{ el }}</div>
          </div>
        </MarqueeBase>
      </div>

      <div>
        <h3>Images</h3>
        <MarqueeBase :pause-on-hover="true" :pause-on-click="true">
          <div v-for="el in imgArray" class="size-64 mx-4">
            <img :src="el.img" alt="" class="object-cover w-full h-full">
          </div>
        </MarqueeBase>
      </div>

      <div>
        <h3>Cards vert</h3>
        <div class="h-64 p-12 bg-gray-100 rounded-xl w-fit">
          <MarqueeBase :pause-on-hover="true" :pause-on-click="true" :vertical="true">
            <div v-for="el in 5" class="my-4">
              <MyCard class="w-64 grid justify-center items-center">
                <h4>test</h4>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae odit iste nesciunt et deleniti ducimus
                  eum neque reprehenderit culpa a nobis consequuntur ad, accusantium labore aut amet eius alias quia?
                </p>
              </MyCard>
            </div>
          </MarqueeBase>
        </div>
      </div>

      <div>
        <div>
          <h3>Cards horiz</h3>
          <MarqueeBase :pause-on-hover="true" :pause-on-click="true" :vertical="false">
            <div v-for="el in 10" class="mx-3">
              <MyCard class="w-96 grid justify-center items-center ">
                <h4>test</h4>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae odit iste nesciunt et deleniti ducimus
                  eum neque reprehenderit culpa a nobis consequuntur ad, accusantium labore aut amet eius alias quia?
                </p>
              </MyCard>
            </div>
          </MarqueeBase>
        </div>
      </div>

      <div class="">
        <h3>Images + gradient</h3>
        <MarqueeBase :pause-on-hover="true" :pause-on-click="true">
          <div v-for="el in imgArray" class="size-64 mx-3">
            <img :src="el.img" alt="" class="object-cover w-full h-full">
          </div>
        </MarqueeBase>
      </div> -->
    </section>

    <section class="container mx-auto">
      <DesignTableDisplay />
    </section>
  </div>
</template>

<script setup>
const { t, locale } = useI18n()
const title = computed(() => t('pages.index.title'))
const description = computed(() => t('pages.index.description'))

useHead({
  title: title,
  meta: [
    { property: 'description', content: description },
    { property: 'og:description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: locale },
    // { property: 'og:url', content: 'https://nuxt.com' },
    // { property: 'og:image', content: 'https://nuxt.com/social.jpg' },
  ]
})

const { slideTop, slideLeft, slideRight, fade, slideBottom } = useAnimations();

const helloArray = ['hello', 'こんにちは', 'bonjour', 'hej', 'hola', 'ciao', '안녕하세요', 'hallo', 'привет', 'مرحبا', 'नमस्ते', 'สวัสดี', 'γεια σας', '你好', 'こんにちは', '안녕하세요', 'سلام', 'שלום', 'xin chào', 'olá'];

const helloArraySmall = ['hello', 'こんにちは'];

const imgArray = ref([
  {
    img: `/img/placeholder.jpg`
  },
  {
    img: `/img/placeholder.jpg`
  },
  {
    img: `/img/placeholder.jpg`
  },
  {
    img: `/img/placeholder.jpg`
  },
  {
    img: `/img/placeholder.jpg`
  },
  {
    img: `/img/placeholder.jpg`
  }
])
</script>