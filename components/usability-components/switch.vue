<template>
    <SwitchGroup as="div" class="flex gap-x-4 col-span-2">
        <div class="flex h-6 items-center">
            <Switch v-model="agreed"
                :class="[agreed ? 'bg-indigo-600' : 'bg-gray-200', 'flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600']">
                <span class="sr-only">{{ label }} {{ labelLink }}</span>
                <span aria-hidden="true"
                    :class="[agreed ? 'translate-x-3.5' : 'translate-x-0', 'h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out']" />
            </Switch>
        </div>
        <SwitchLabel class="text-sm leading-6 text-gray-600">
            {{ label }}
            {{ ' ' }}
            <nuxt-link :to="{ name: 'PrivacyPolicy' }" class="font-semibold text-indigo-600">{{ labelLink }}</nuxt-link>
        </SwitchLabel>
    </SwitchGroup>
</template>

<script setup>
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'

const props = defineProps({
    label: String,
    labelLink: String,
    name: String,
    required: Boolean,
    modelValue: String,
    agreed: Boolean,
});

const agreed = ref(props.agreed);
</script>