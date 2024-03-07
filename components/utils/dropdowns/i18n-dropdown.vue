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
    <!-- <div v-auto-animate class="absolute w-screen h-screen top-0 left-0 pointer-events-none">
            <div v-if="isLoading" class=" bg-gray-900/60 overflow-hidden">
                <div class="flex flex-col items-center justify-center w-screen h-screen text-center space-y-5">
                    <Icon name="svg-spinners:ring-resize" class="w-16 h-16 text-white" />
                    <p class="text-3xl text-white font-bold font-header">Translating in process, please wait</p>
                </div>
            </div>
        </div> -->
</template>

<script setup>
const router = useRouter();
const { locales, setLocale, getLocaleCookie } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const formKit = inject(Symbol.for('FormKitConfig'))
const isLoading = ref(false);

let selectedLocale = ref('');
const selectedFormKitLocale = ref('')

onMounted(async () => {
    selectedLocale.value = await getLocaleCookie();
    selectedFormKitLocale.value = selectedLocale.value;
    formKit.locale = selectedFormKitLocale.value;
});

onBeforeUnmount(() => {
    document.body.style.overflow = '';
});

const availableLocales = computed(() => {
    return (locales.value).filter(i => i.code)
})

const changeLocale = (newLocale) => {
    isLoading.value = true;
    document.body.style.overflow = 'hidden'; // Block scrolling
    setLocale(newLocale);
    router.push(switchLocalePath(newLocale));
    selectedLocale.value = newLocale;
    formKit.locale = newLocale;
    isLoading.value = false;
    document.body.style.overflow = '';
}
</script>