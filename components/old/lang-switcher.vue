<script setup>
const router = useRouter();
const { locales, setLocale, getLocaleCookie } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const formKit = inject(Symbol.for('FormKitConfig'))

let selectedLocale = ref('');
const selectedFormKitLocale = ref('')

onMounted(async () => {
  selectedLocale.value = await getLocaleCookie();
  selectedFormKitLocale.value = selectedLocale.value;
  formKit.locale = selectedFormKitLocale.value;
});

const availableLocales = computed(() => {
  return (locales.value).filter(i => i.code)
})

const changeLocale = (newLocale) => {
  setLocale(newLocale);
  router.push(switchLocalePath(newLocale));
  selectedLocale.value = newLocale;
  formKit.locale = newLocale;
}
</script>

<template>
  <div>
    <select v-model="selectedLocale" @change="changeLocale($event.target.value)">
      <option
          v-for="loc in availableLocales"
          :key="loc.code"
          :value="loc.code">
        {{ loc.code }}
      </option>
    </select>
  </div>
</template>
