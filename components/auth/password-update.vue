<script setup>
const localePath = useLocalePath()
const { updatePassword } = useAuthentication();
const { handleSubmit } = useSubmit();

async function handleForm(data) {
  await handleSubmit(updatePassword, data.password, 'Password updated');
}
</script>

<template>
  <div class="flex flex-col gap-6 h-full">
    <div>
      <h1 class="text-clamp-3xl md:text-clamp-xl">Update your password</h1>
    </div>

    <div class="space-y-3">
      <FormWrapper :handleSubmit="handleForm" :submit-attrs="{ inputClass: 'w-full btn-primary' }" submit-label="Reset">
        <template #default="{ getNode }">
          <div class="space-y-2 mb-3">
            <FormKit class="w-full" type='primePassword' name='password' validation='required' toggleMask :feedback="true"
              placeholder='Password' @node="getNode">
            </FormKit>

            <FormKit class="w-full" type='primePassword' name='password_confirm' validation='required|confirm' toggleMask
              placeholder='Repeat password' @node="getNode">
            </FormKit>
          </div>
        </template>
      </FormWrapper>
    </div>
  </div>
</template>
