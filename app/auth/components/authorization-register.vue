<template>
  <div>
    <div class="grid place-content-center">
      <Logo type="logotype" color="black" class="h-8 mx-auto" />
      <h2
        class="mt-4 text-2xl font-bold leading-9 tracking-tight text-gray-900"
      >
        {{ t("auth.createANewAccount") }}
      </h2>
    </div>

    <div class="mt-5">
      <div>
        <FormWrapper
          :zodSchema="registerSchema"
          :handleSubmit="handleForm"
          :reset-on-submit="true"
          :submitAttrs="{ inputClass: 'w-full btn btn-primary' }"
          :submitLabel="t('register')"
        >
          <div class="space-y-2 mb-2">
            <FormKit
              class="w-full"
              type="primeInputText"
              name="email"
              validation="required|email"
              :placeholder="t('auth.inputFields.email')"
            >
            </FormKit>
            <FormKit
              class="w-full"
              type="primePassword"
              name="password"
              validation="required|length:6"
              toggleMask
              :feedback="true"
              :placeholder="t('auth.inputFields.password')"
            >
            </FormKit>
            <FormKit
              class="w-full"
              type="primePassword"
              name="password_confirm"
              validation="required|confirm"
              toggleMask
              :placeholder="t('auth.inputFields.confirmPassword')"
            >
            </FormKit>
          </div>
        </FormWrapper>
        <div>
          <div class="relative mt-7">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div
              class="relative flex justify-center text-sm font-medium leading-6"
            >
              <span class="bg-gray-50 px-6 text-gray-900">{{
                t("auth.orContinueWith")
              }}</span>
            </div>
          </div>

          <OAuth />
        </div>

        <div class="mt-5 text-center">
          <NuxtLink
            :to="localePath({ name: 'login' })"
            class="text-sm font-medium text-gray-600"
          >
            {{ t("auth.alreadyHaveAnAccount") }}
            <span class="text-primary-500">{{ t("auth.signIn") }}!</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { registerSchema } from "~~/utils/schemas";
import { type RegisterForm } from "~~/types/register";
const { t } = useI18n();

const localePath = useLocalePath();
const { signUp } = useAuthentication();
const { submit, isLoading, error } = useForm();
const captchaToken = ref<string | null>(null);

async function handleForm(data: RegisterForm) {
  await submit({
    action: () =>
      signUp({
        email: data.email,
        password: data.password,
        options: { captchaToken: captchaToken.value },
      }),
    successTitle: "Registration Successful",
    successMessage: "Please check your email for a verification link.",
    errorTitle: "Registration Failed",
    errorMessage: (e) => `${e.message}. Please try again.`,
  });
}
</script>
