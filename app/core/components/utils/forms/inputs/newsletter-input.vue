<template>
  <ClientOnly>
    <FormWrapper
      :zodSchema="emailSchema"
      :handleSubmit="handleSubmit"
      :submitAttrs="{
        inputClass: 'btn-primary btn btn-xs w-full sm:w-auto md:w-1/2',
      }"
    >
      <FormKit
        class="w-full"
        type="primeInputText"
        name="email"
        validation="required|email"
        placeholder="Email"
      />
    </FormWrapper>
  </ClientOnly>
</template>

<script setup lang="ts">
import { emailSchema } from "~~/utils/schemas";
import { type EmailForm } from "~~/types/email";

const { showToast } = useToastService();

const handleSubmit = async (email: EmailForm) => {
  try {
    const response = await $fetch("/api/newsletter", {
      method: "POST",
      body: email,
    });

    if (response.success) {
      showToast({
        severity: "success",
        summary: "Success",
        detail: "Thank you for subscribing to our newsletter",
      });
    }
  } catch (error: any) {
    if (error?.status === 409) {
      showToast({
        severity: "error",
        summary: "Error",
        detail: "You are already subscribed to our newsletter",
        life: 15000,
      });
    } else {
      showToast({
        severity: "error",
        summary: "Error",
        detail: "An error occurred. Please try again later",
      });
    }
  }
};
</script>
