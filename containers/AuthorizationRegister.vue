<template>
  <div>
    <div class="grid place-content-center">
      <Logo type="logotype" color="black" class="h-8  mx-auto" />
      <h2 class="mt-4 text-2xl font-bold leading-9 tracking-tight text-gray-900">Create a new account</h2>
    </div>

    <div class="mt-5">
      <div>
        <form action="#" @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <InputCustom type="email" label="Email" name="email" v-model="email" required></InputCustom>
          </div>

          <div>
            <InputCustom v-model="password" type="password" label="Password" name="password"></InputCustom>
          </div>

          <div>
            <p v-if="errorMsg" class="text-sm mb-2 text-red-600">{{ errorMsg }}</p>
            <p v-else-if="successMsg" class="text-sm mb-2 text-green-600">{{ successMsg }}</p>
            <Button type="submit" class="w-full h-9" size="xs">
              Sign up
            </Button>
          </div>
        </form>

        <div>
          <div class="relative mt-7">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div class="relative flex justify-center text-sm font-medium leading-6">
              <span class="bg-gray-50 px-6 text-gray-900">Or continue with</span>
            </div>
          </div>

          <OAuth/>
        </div>

        <div class="mt-5 text-center">
          <NuxtLink :to="localePath('/login')" class="text-sm font-medium text-gray-600">
            Already have an account? <span class="text-primary-500">Sign in!</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const localePath = useLocalePath()
const { addToast } = useToast();

const {signUp} = useAuthentication();

const email = ref('');
const password = ref('');
const errorMsg = ref(null)
const successMsg = ref(null)

async function handleSubmit() {
  try {
    successMsg.value = await signUp(email, password);
  } catch (error) {
    errorMsg.value = error;
  }
}
</script>