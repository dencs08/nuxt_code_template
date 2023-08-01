<template>
  <div>
    <div class="grid place-content-center">
      <Logo type="logotype" color="black" class="h-8  mx-auto" />
      <h2 class="mt-4 text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
    </div>

    <div class="mt-5">
      <div>
        <form action="#" @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <InputCustom type="email" label="Email" name="email" v-model="email" required></InputCustom>
          </div>

          <div>
            <InputCustom v-model="password" type="password" label="Password" name="password" required>
            </InputCustom>

          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Checkbox v-model="remember" name="remember-me" label="Remember me" type="checkbox" />
            </div>

            <div class="text-sm leading-6">
              <a href="#" class="font-medium text-primary-500 hover:text-primary-600">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <Button type="submit" class="w-full h-9" size="xs">
              Sign in
            </Button>
          </div>
        </form>

        <div>
          <div class="relative mt-7">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div class="relative flex justify-center text-sm font-medium leading-6">
              <span class="bg-gray-50 px-6 text-gray-900">Or sign in with</span>
            </div>
          </div>

          <OAuth/>
        </div>

        <div class="mt-5 text-center">
          <NuxtLink :to="localePath('/register')" class="text-sm font-medium text-gray-600">
            Don't have an account yet? <span class="text-primary-500">Create one!</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const localePath = useLocalePath()
const { addToast } = useToast();

const {signIn} = useAuthentication();

const email = ref('');
const password = ref('');
const remember = ref(false);

async function handleSubmit() {
  try {
    await signIn(email,password);
    navigateTo('/dashboard', { external: true })
  } catch (error) {
    addToast({ message: error.message, duration: 3000, type: 'danger' });
  }
}
</script>