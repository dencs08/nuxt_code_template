<template>
    <Select :modelValue="selectedLocale" @update:modelValue="changeLocale($event)" :options="availableLocales"
        optionLabel="iso" optionValue="code">
    </Select>
    <!-- <div v-auto-animate class="absolute w-screen h-screen top-0 left-0 pointer-events-none">
            <div v-if="isLoading" class=" bg-gray-900/60 overflow-hidden">
                <div class="flex flex-col items-center justify-center w-screen h-screen text-center space-y-5">
                    <Icon name="svg-spinners:ring-resize" class="w-16 h-16 text-white" />
                    <p class="text-3xl text-white font-bold font-header">Translating in process, please wait</p>
                </div>
            </div>
        </div> -->
</template>

<script setup lang="ts">
interface FormKit {
    locale: string;
}

const router = useRouter();
const { locales, setLocale, getLocaleCookie } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const formKit = inject<FormKit>(Symbol.for('FormKitConfig'))
const isLoading = ref(false);

let selectedLocale: Ref<string> = ref('');
const selectedFormKitLocale: Ref<string> = ref('')

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

const changeLocale = (newLocale: string) => {
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