<template>
  <div class="flex min-h-full flex-1">
    <div class="flex flex-1 flex-col justify-center items-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <Logo type="logotype" color="black" class="h-8 w-auto" />
          <h2 class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
        </div>

        <div class="mt-10">
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
                  <a href="#" class="font-medium text-primary-500 hover:text-primary-600">Forgot
                    password?</a>
                </div>
              </div>

              <div>
                <Button type="submit" class="w-full h-9" size="xs">
                  Sign in
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute top-0 left-0 lg:relative lg:w-0 lg:flex-1 lg:block">
      <!-- Desktop -->
      <nuxt-img class="hidden lg:block lg:absolute -top-1 inset h-[101vh] w-screen object-cover"
           src="/img/placeholder.jpg" format="webp" quality="100" />
      <!-- Mobile -->
      <nuxt-img class="opacity-25 lg:hidden inset h-screen w-screen object-cover" src="/img/placeholder.jpg"
           alt="" format="webp" quality="20" />
    </div>
  </div>
</template>

<script setup>
const email = ref('');
const password = ref('');
const remember = ref(false);
const { signIn } = useAuth();

const { addToast } = useToast();

async function handleSubmit() {
  try {
    await signIn('credentials', { redirect: false, email: email.value, password: password.value, remember: remember.value });
    navigateTo('/dashboard', { external: true })
  } catch (error) {
    addToast({ message: 'Wrong email or password', duration: 3000, type: 'danger' });
    console.error(error);
  }
}
</script>