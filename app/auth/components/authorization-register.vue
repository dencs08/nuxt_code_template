<template>
  <div>
    <div class="grid place-content-center">
      <Logo type="logotype" color="black" class="h-8 mx-auto" />
      <h2
        class="mt-4 text-2xl font-bold leading-9 tracking-tight text-gray-900"
      >
        Create a new account
      </h2>
    </div>

    <div class="mt-5">
      <div>
        <FormWrapper
          :zodSchema="registerSchema"
          :handleSubmit="handleForm"
          :submitAttrs="{ inputClass: 'w-full btn btn-primary' }"
          submitLabel="Register"
        >
          <div class="space-y-2 mb-5">
            <FormKit
              class="w-full"
              type="primeInputText"
              name="name"
              validation="required"
              placeholder="Name"
            >
            </FormKit>
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
              :feedback="true"
              placeholder="Password"
            >
            </FormKit>
            <FormKit
              class="w-full"
              type="primePassword"
              name="password_confirm"
              validation="required|confirm"
              toggleMask
              placeholder="Repeat password"
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
              <span class="bg-gray-50 px-6 text-gray-900"
                >Or continue with</span
              >
            </div>
          </div>

          <OAuth />
        </div>

        <div class="mt-5 text-center">
          <NuxtLink
            :to="localePath({ name: 'login' })"
            class="text-sm font-medium text-gray-600"
          >
            Already have an account?
            <span class="text-primary-500">Sign in!</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { registerSchema } from "~~/utils/schemas";
import { type RegisterForm } from "~~/types/register";

const localePath = useLocalePath();
const { signUp } = useAuthentication();
const { handleSubmit } = useSubmit();

async function handleForm(data: RegisterForm) {
  await handleSubmit(
    signUp,
    { email: data.email, password: data.password },
    "Registration link sent!"
  );
}
</script>
