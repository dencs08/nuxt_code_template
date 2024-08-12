<template>
  <FormWrapper
    :zodSchema="emailSchema"
    :handleSubmit="handleSubmit"
    :submitAttrs="{
      inputClass: 'btn-primary btn btn-xs w-full sm:w-auto md:w-1/2',
    }"
    submitLabel="Send"
  >
    <FormKit
      class="w-full"
      type="primeInputText"
      name="email"
      validation="required|email"
      placeholder="Email"
    />
  </FormWrapper>
</template>

<script setup lang="ts">
import { emailSchema } from "@/utils/schemas";
import { type EmailForm } from "@/utils/types/email";

const { addToast } = useToastService();

const handleSubmit = async (email: EmailForm) => {
  try {
    const response = await $fetch("/api/newsletter", {
      method: "POST",
      body: email,
    });

    if (response.response.success) {
      addToast(
        "success",
        "Success",
        "Thank you for subscribing to our newsletter"
      );
    }
  } catch (error: any) {
    if (error.response?.status === 409) {
      addToast(
        "error",
        "Error",
        "You are already subscribed to our newsletter"
      );
    } else {
      addToast("error", "Error", "An error occurred. Please try again later");
    }
  }
};
</script>
