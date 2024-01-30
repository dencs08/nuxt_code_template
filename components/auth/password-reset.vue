<script setup>
const localePath = useLocalePath()
const { lostPassword } = useAuthentication();
const { handleSubmit } = useSubmit();

async function handleForm(data) {
  await handleSubmit(lostPassword, { email: data.email }, 'Reset link sent');
}
</script>

<template>
  <div class="flex flex-col gap-6 h-full">
    <div>
      <h1 class="text-clamp-3xl md:text-clamp-xl">Forgot password?</h1>
      <p class="text-gray-600">No worries, you can reset it here.</p>
    </div>

    <div class="space-y-3">
      <FormWrapper :handleSubmit="handleForm">
        <template #default="{ getNode }">
          <div class="mb-2">
            <FormKit class="w-full" type='primeInputText' name='email' validation='required|email'
              validationVisibility='submit' placeholder='Email' @node="getNode">
            </FormKit>
          </div>
        </template>
      </FormWrapper>

      <NuxtLink :to="localePath({ name: 'login' })"
        class="flex items-center justify-center gap-1 text-gray-600 text-sm group">
        <Icon name="ic:round-arrow-back"
          class="h-auto w-5 group-hover:-translate-x-1 transition-transform duration-150" />
        <span>Back to log in</span>
      </NuxtLink>
    </div>
  </div>
</template>