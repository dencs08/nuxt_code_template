<template>
  <div>
    <div class="grid place-content-center">
      <Logo type="logotype" color="black" class="h-8 mx-auto" />
      <h2
        class="mt-4 text-2xl font-bold leading-9 tracking-tight text-gray-900"
      >
        Sign in to your account
      </h2>
    </div>

    <div class="mt-5">
      <div>
        <FormWrapper
          :zod-schema="loginSchema"
          :reset-on-submit="true"
          :handle-submit="handleForm"
          submit-label="Login"
        >
          <div class="space-y-2">
            <div class="space-y-2 mb-5">
              <FormKit
                class="w-full"
                type="primeInputText"
                name="email"
                validation="required|email"
                placeholder="Email"
              >
              </FormKit>

              <FormKit
                class="w-full"
                type="primePassword"
                name="password"
                validation="required|length:6"
                toggleMask
                placeholder="Password"
              >
              </FormKit>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <FormKit
                  type="primeCheckbox"
                  name="remember-me"
                  id="remember-me"
                />
                <label for="remember-me">Remember me</label>
              </div>

              <div class="text-sm leading-6">
                <NuxtLink
                  :to="localePath({ name: 'lost-password' })"
                  class="font-medium text-primary-500 hover:text-primary-600"
                >
                  Forgot password?
                </NuxtLink>
              </div>
            </div>
          </div>
        </FormWrapper>

        <div class="mb-3">
          <div class="relative mt-5">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div
              class="relative flex justify-center text-sm font-medium leading-6"
            >
              <span class="bg-gray-50 px-6 text-gray-900">Or sign in with</span>
            </div>
          </div>

          <OAuth />
        </div>

        <div class="mb-3 text-center">
          <NuxtLink
            :to="localePath({ name: 'register' })"
            class="text-sm font-medium text-gray-600"
          >
            Don't have an account yet?
            <span class="text-primary-500">Create one!</span>
          </NuxtLink>
        </div>

        <div class="grid place-content-center">
          <NuxtTurnstile ref="captchaToken" v-model="captchaToken" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { loginSchema } from "~~/utils/schemas";
import { type LoginForm } from "~~/types/login";

const localePath = useLocalePath();
const { signIn } = useAuthentication();
const { handleSubmit } = useSubmit();

//TODO cannot test if this captcha works without deploying to production - also test the supabase captcha settings and if it works (on production).
const captchaToken = ref();

async function handleForm(data: LoginForm) {
  await handleSubmit(
    signIn,
    { email: data.email, password: data.password, options: { captchaToken } },
    "Redirecting to your account...",
    localePath("/main"),
    true
  );
  captchaToken.value.reset();
}
</script>
