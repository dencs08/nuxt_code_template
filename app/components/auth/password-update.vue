<script setup lang="ts">
// TODO check if it works after adding zod schema and Form
import { passwordConfirmSchema } from "~~/utils/schemas";
import { type PasswordConfirm } from "~~/types/passwordConfirm";

const localePath = useLocalePath();
const { updatePassword } = useAuthentication();
const { handleSubmit } = useSubmit();

async function handleForm(data: PasswordConfirm) {
  await handleSubmit(updatePassword, data.password, "Password updated");
  navigateTo(localePath({ name: "dash-home" }));
}
</script>

<template>
  <div class="flex flex-col gap-6 h-full">
    <div>
      <h1 class="text-clamp-3xl md:text-clamp-xl">Update your password</h1>
    </div>

    <div class="space-y-3">
      <FormWrapper
        :zodSchema="passwordConfirmSchema"
        :handleSubmit="handleForm"
        :submitAttrs="{ inputClass: 'w-full btn-primary' }"
        submitLabel="Submit"
      >
        <div class="space-y-2 mb-3">
          <FormKit
            class="w-full"
            type="primePassword"
            name="password"
            validation="required"
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
    </div>
  </div>
</template>
