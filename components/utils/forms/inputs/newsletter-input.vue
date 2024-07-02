<template>
    <FormWrapper :zodSchema="emailSchema" :handleSubmit="handleSubmit"
        :submitAttrs="{ inputClass: 'btn-primary btn btn-xs w-full sm:w-auto md:w-1/2' }" submitLabel="Send">
        <FormKit class="w-full" type='primeInputText' name='email' validation='required|email' placeholder='Email' />
    </FormWrapper>
</template>

<script setup lang="ts">
import { emailSchema } from '~/utils/schemas';
import { type EmailForm } from '@/utils/types/email';

// TODO make it work
const handleSubmit = async (email: EmailForm) => {
    // const response = await handleSubmit(authStore.logout, data, 'User successfully logged out');
}
</script>