<script setup lang="ts">
import { passwordConfirmSchema } from "~~/utils/schemas";
import { type PasswordConfirm } from "~~/types/passwordConfirm";

const localePath = useLocalePath();
const { addToast } = useToastService();

async function handleForm(data: PasswordConfirm) {
  try {
    const { error } = (await $fetch("/api/me/password-update", {
      method: "POST",
      body: data,
    })) as { error?: any };
    if (error) {
      throw new CustomError("Error updating user data", error);
    }

    addToast(
      "success",
      "Password updated",
      "You will be redirected to the dashboard in a few seconds..."
    );
    setTimeout(() => {
      navigateTo(localePath({ name: "dash-home" }), { replace: true });
    }, 2000);
    return { response: "Password updated" };
  } catch (e: any) {
    addToast("error", "Error updating password", e.message);
    throw new CustomError("An error occurred during the update process", e);
  }
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
        :reset-on-submit="true"
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
