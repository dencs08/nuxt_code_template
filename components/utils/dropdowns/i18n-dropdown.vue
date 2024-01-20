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
    <Dropdown :modelValue="selectedLocale" @update:modelValue="changeLocale($event)" :options="availableLocales"
        optionLabel="iso" optionValue="code" :pt="{
            root: ({ props, state }) => ({
                class: [
                    'inline-flex relative bg-surface-0 dark:bg-surface-900 border border-surface-300 dark:border-surface-700 rounded-md transition-all duration-200 hover:border-primary-500 dark:hover:border-primary-300 cursor-pointer select-none',

                    'w-30 md:w-32', //control width of this dropdown

                    { 'outline-none outline-offset-0 ring ring-primary-400/50 dark:ring-primary-300/50': state.focused },
                    { 'opacity-60': props.disabled, 'pointer-events-none': props.disabled, 'cursor-default': props.disabled }
                ]
            })
        }">
    </Dropdown>
</template>
