<script setup lang="ts">
import { emailSchema } from "~~/utils/schemas";
import { type EmailForm } from "~~/types/email";

const localePath = useLocalePath();
const { lostPassword } = useAuthentication();
const { handleSubmit } = useSubmit();
const { t } = useI18n();

async function handleForm(data: EmailForm) {
  try {
    const response = await handleSubmit(
      lostPassword,
      { email: data.email },
      "Reset link sent"
    );
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 h-full">
    <div>
      <h1 class="text-clamp-3xl md:text-clamp-xl">
        {{ t("auth.forgotYourPassword") }}
      </h1>
      <p class="text-gray-600">{{ t("auth.forgotYourPasswordDescription") }}</p>
    </div>

    <div class="space-y-3">
      <FormWrapper :zodSchema="emailSchema" :handleSubmit="handleForm">
        <div class="mb-2">
          <FormKit
            class="w-full"
            type="primeInputText"
            name="email"
            validation="required|email"
            validationVisibility="submit"
            :placeholder="t('auth.inputFields.email')"
          >
          </FormKit>
        </div>
      </FormWrapper>

      <NuxtLink
        :to="localePath({ name: 'login' })"
        class="flex items-center justify-center gap-1 text-gray-600 text-sm group"
      >
        <Icon
          name="ic:round-arrow-back"
          class="h-auto w-5 group-hover:-translate-x-1 transition-transform duration-150"
        />
        <span>{{ t("auth.backToLogin") }}</span>
      </NuxtLink>
    </div>
  </div>
</template>
