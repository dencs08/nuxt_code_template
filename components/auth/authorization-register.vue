<template>
  <div>
    <div class="grid place-content-center">
      <Logo type="logotype" color="black" class="h-8  mx-auto" />
      <h2 class="mt-4 text-2xl font-bold leading-9 tracking-tight text-gray-900">Create a new account</h2>
    </div>

    <div class="mt-5">
      <div>
        <FormWrapper :handleSubmit="handleForm" :submit-attrs="{ inputClass: 'w-full btn-primary' }"
          submit-label="Register">
          <template #default="{ getNode }">
            <div class="space-y-2 mb-5">
              <FormKit class="w-full" type='primeInputText' name='email' validation='required|email' placeholder='Email'
                @node="getNode">
              </FormKit>

              <FormKit class="w-full" type='primePassword' name='password' validation='required' toggleMask
                :feedback="true" placeholder='Password' @node="getNode">
              </FormKit>

              <FormKit class="w-full" type='primePassword' name='password_confirm' validation='required|confirm'
                toggleMask placeholder='Repeat password' @node="getNode">
              </FormKit>
            </div>
          </template>
        </FormWrapper>
        <div>
          <div class="relative mt-7">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div class="relative flex justify-center text-sm font-medium leading-6">
              <span class="bg-gray-50 px-6 text-gray-900">Or continue with</span>
            </div>
          </div>

          <OAuth />
        </div>

        <div class="mt-5 text-center">
          <NuxtLink :to="localePath({ name: 'login' })" class="text-sm font-medium text-gray-600">
            Already have an account? <span class="text-primary-500">Sign in!</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Form {
  email: string;
  password: string;
  password_confirm: string;
}

const localePath = useLocalePath()
const { signUp } = useAuthentication();
const { handleSubmit } = useSubmit();

async function handleForm(data: Form) {
  await handleSubmit(signUp, { email: data.email, password: data.password }, 'Registration link sent!');
}
</script>