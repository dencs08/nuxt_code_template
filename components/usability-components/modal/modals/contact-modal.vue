<template>
    <ModalWrapper @confirm="submitForm" @close="closeAction" :modalProps="{ isRevealed }" size="xl">

        <div class="relative isolate bg-white rounded-lg py-24">
            <div class="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
                <div class="relative px-6 sm:px-10 lg:px-14 lg:static">
                    <div class="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
                        <div class="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-gray-100 ring-1 ring-gray-900/10 lg:w-1/2 rounded-lg">
                            <svg class="absolute inset-0 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" aria-hidden="true">
                                <defs>
                                    <pattern id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527" width="200" height="200" x="100%" y="-1" patternUnits="userSpaceOnUse">
                                        <path d="M130 200V.5M.5 .5H200" fill="none" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" stroke-width="0" fill="white" />
                                <svg x="100%" y="-1" class="overflow-visible fill-gray-50">
                                    <path d="M-470.5 0h201v201h-201Z" stroke-width="0" />
                                </svg>
                                <rect width="100%" height="100%" stroke-width="0" fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
                            </svg>
                        </div>
                        <h2 class="text-3xl font-bold tracking-tight text-gray-900">Zostańmy w kontakcie</h2>
                        <p class="mt-6 text-lg leading-8 text-gray-600">
                            Skontakuj się z nami poprzez preferowaną formę kontaktu, nasz dział odpowie tak szybko jak to możliwe.
                        </p>
                        <dl class="mt-10 space-y-4 text-base leading-7 text-gray-600">
                            <div class="flex gap-x-4">
                                <dt class="flex-none">
                                    <span class="sr-only">Address</span>
                                    <Icon name="ic:round-apartment" class="h-7 w-6 text-gray-400" aria-hidden="true"/>
                                </dt>
                                <dd>{{config.public.address}}</dd>
                            </div>
                            <div class="flex gap-x-4">
                                <dt class="flex-none">
                                    <span class="sr-only">Telephone</span>
                                    <Icon name="ic:round-local-phone" class="h-7 w-6 text-gray-400" aria-hidden="true"/>
                                </dt>
                                <dd><a class="hover:text-gray-900" :href="`tel:${config.public.phone}`">{{ config.public.phone }}</a></dd>
                            </div>
                            <div class="flex gap-x-4">
                                <dt class="flex-none">
                                    <span class="sr-only">Email</span>
                                    <Icon name="ic:round-email" class="h-7 w-6 text-gray-400" aria-hidden="true"/>
                                </dt>
                                <dd><a class="hover:text-gray-900" :href="`mailto:${config.public.email}`">{{ config.public.email }}</a></dd>
                            </div>
                        </dl>
                    </div>
                </div>
                <div class="mx-auto">
                    <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-5">
                        <InputCustom v-model="formData.name" type="text" label="Name" required/>
                        <InputCustom v-model="formData.phone" type="phone" label="Phone" optional/>
                        <InputCustom v-model="formData.email" type="email" label="Email" class="col-span-2" required/>
                        <TextAreaCustom v-model="formData.message" type="text" label="Message"  class="col-span-2 border-0 m-0 p-0" :rows="5" :max-length="1000" required/>
                        <Button styling="success" size="xs" class="h-9 w-full sm:w-auto" submit>Submit</Button>
                    </form>
                </div>
            </div>
        </div>

        <template #actions>
            <Button styling="light" size="xs" class="h-9 w-full sm:w-auto" @click="closeAction">Close</Button>
        </template>
    </ModalWrapper>
</template>

<script setup>
const props = defineProps({
    isRevealed: {
        type: Boolean,
        default: false,
    },
    message: {
        type: String,
        default: 'Are you sure?'
    },
})
const emit = defineEmits(['confirm', 'close'])

const formData = reactive({
    name: '',
    email: '',
    phone: '',
    message: '',
})

const { error, submit } = useContact();
const submitForm = async () => {
    await submit(formData)
    if (!error.value) {
        emit('close')
    }
}
const closeAction = () => {
    emit('close')
}

const config = useRuntimeConfig()

</script>
