<template>
  <div>
    <section class="container mx-auto py-32 grid place-content-center text-center">
      <h1 v-motion="slideTop({ delay: 200 })">
        {{ t('pages.index.content.hero.h1') }}
      </h1>
      <h2 class="font-body text-3xl font-bold flex flex-row gap-2 justify-center">
        <div v-for="(word, index) in heroH2Words" :key="index" class="text-2xl"
          v-motion="fade({ delay: 300, index: index, interval: 50 })">
          {{ word }}
        </div>
      </h2>
    </section>

    <section class="container mx-auto py-32">
      <AppInputText v-model="parentValue" id="test" placeholder="Placeholder" />
      <AppInputText v-model="parentValue" id="test2" placeholder="Placeholder" float />

      <FormWrapper :handleSubmit="() => { }" submit-label="Login" :plugins="[zodPlugin]">
        <template #default="{ getNode }">
          <div class="space-y-2 mb-5">
            <FormKit class="w-full" type='primeInputText' name='email' validation='required|email' placeholder='Email'
              @node="getNode">
            </FormKit>

            <FormKit class="w-full" type='primeInputText' name='firstName' validation='required|string|length:3,25'
              placeholder='firstName' @node="getNode">
            </FormKit>
            <FormKit class="w-full" type='primeInputText' name='lastName' validation='required|string|length:3,25'
              placeholder='lastName' @node="getNode">
            </FormKit>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <FormKit type="primeCheckbox" name='remember-me' id="remember-me" />
              <label for="remember-me">Remember me</label>
            </div>
          </div>
        </template>
      </FormWrapper>

      <!-- <PrimeInput header="Formkit Demo" :schema="schema" :data="data" /> -->

      <div class="myFormkit">
        <FormKit class="w-full" id="form" v-model="data" type="form" :submit-attrs="{
        inputClass: 'btn btn-primary btn-sm',
      }" @submit="() => { }">
          <FormKitSchema class="w-full" :schema="schema" :data="data" />
        </FormKit>
      </div>
      <h4>Data</h4>
      <pre>{{ data }}</pre>
    </section>

    <section class="container mx-auto space-y-12">
      <div>
        <h3>Test nuxt-img</h3>
        <div class="size-full sm:size-64 md:size-80 lg:size-96">
          <CustomNuxtImg></CustomNuxtImg>
        </div>
      </div>
      <div>
        <h3>Text vert + hover</h3>
        <div class="h-64 bg-gray-100 rounded-xl">
          <MarqueeBase :clone="true" :duration="5" :gradient="true" :gradient-color="[250, 250, 250]"
            gradient-length="25%" :vertical="true">
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
const { t, locale } = useI18n()
const route = useRoute()
const business = useBusiness()

const title = computed(() => t('pages.index.meta.title'))
const description = computed(() => t('pages.index.meta.description'))

const url = business.url.value + route.fullPath;

useHead({
  title: title,
  link: [{ rel: 'canonical', href: url }],
  meta: [
    { name: 'description', content: description },
    { name: 'og:description', content: description },
    { name: 'og:title', content: title },
    { name: 'og:type', content: 'website' },
    { name: 'og:locale', content: locale },
    // { property: 'og:url', content: 'https://nuxt.com' },
    // { property: 'og:image', content: 'https://nuxt.com/social.jpg' },
  ]
})

const { slideTop, slideLeft, slideRight, fade, slideBottom } = useAnimations();

const heroH2Words = computed(() => t('pages.index.content.hero.h2').split(' '));

const helloArraySmall = ['hello', 'こんにちは', 'bonjour', 'hej', 'hola', 'ciao'];

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
const parentValue = ref('');

const { addElement } = useFormKitSchema();

import { createZodPlugin } from '@formkit/zod'
import { z } from 'zod'
const zodSchema = z.object({
  firstName: z.string().min(3).max(25),
  lastName: z.string().min(3).max(25),
  email: z.string().email(),
})

const [zodPlugin, submitHandler] = createZodPlugin(
  zodSchema,
  async (formData) => {
    // fake submit handler, but this is where you
    // do something with your valid data.
    await new Promise((r) => setTimeout(r, 2000))
    alert('Form was submitted!')
    console.log(formData)
  }
)

const options = [
  { label: 'Every page load', value: 'refresh' },
  { label: 'Every hour', value: 'hourly' },
  { label: 'Every day', value: 'daily' },
]

const schema = reactive(
  [
    addElement('h2', ['Register ', '$email']),
    addElement('h3', 'Header Text H3'),
    {
      $formkit: 'primeInputText',
      name: 'email',
      label: 'Email',
      help: 'This will be used for your account.',
      validation: 'required|email',
    },
    {
      $formkit: 'primeTextarea',
      name: 'myText',
      label: 'Text',
      validation: '',
      rows: '3',
    },
    {
      $formkit: 'primeEditor',
      name: 'myEditor',
      label: 'Editor',
      style: 'height: 160px; margin-bottom:80px;',
    },
    {
      $formkit: 'primePassword',
      name: 'password',
      label: 'Password',
      help: 'Enter your new password.',
      validation: 'required|length:5,16',
      feedback: true,
    },
    {
      $formkit: 'primePassword',
      name: 'password_confirm',
      label: 'Confirm password',
      help: 'Enter your new password again.',
      validation: 'required|confirm',
      validationLabel: 'password confirmation',
    },
    {
      $formkit: 'primeCheckbox',
      name: 'eu_citizen',
      id: 'eu',
      label: 'Are you a european citizen?',
    },
    {
      $formkit: 'primeDropdown',
      if: '$get(eu).value', // 👀 Oooo, conditionals!
      name: 'cookie_notice',
      label: 'Cookie notice frequency',
      optionLabel: 'label',
      optionValue: 'value',
      options,
      help: 'How often should we display a cookie notice?',
    },
  ],
)

const data = ref({ email: 'tom@sfxcode.com' })
</script>