<script setup lang="ts">
import { passwordConfirmSchema } from "~~/utils/schemas";
import { type PasswordConfirm } from "~~/types/passwordConfirm";

const localePath = useLocalePath();
const { showToast } = useToastService();
const { signOut } = useAuthentication();

async function handleForm(data: PasswordConfirm) {
  try {
    const response = (await $fetch("/api/v1/me/password-update", {
      method: "POST",
      body: data,
    })) as { error?: any };

    showToast({
      severity: "success",
      summary: "Password updated",
      detail: "Please log in to your account after redirect to the login page",
    });

    setTimeout(async () => {
      await signOut();
      navigateTo(localePath("/login"), { replace: true });
    }, 2000);
    // return { response: "Password updated" };
  } catch (e: any) {
    showToast({
      severity: "error",
      summary: "Error updating password",
      detail: e.message,
    });
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred during the update process",
    });
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
        :submitAttrs="{ inputClass: 'w-full btn btn-primary' }"
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
