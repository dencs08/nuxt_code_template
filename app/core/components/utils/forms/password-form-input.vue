<!-- utils/forms/password-action-confirm.vue -->
<template>
  <div>
    <p class="text-xs mb-1">{{ label }}</p>
    <FormWrapper
      :zodSchema="passwordConfirmSchema"
      type="form"
      v-model="form"
      :submit-attrs="{
        inputClass: 'hidden',
      }"
      :incomplete-message="false"
      :handle-submit="
        (formData) => {
          return formData;
        }
      "
      @validation-change="handlePasswordValidationChange"
    >
      <div class="space-y-2">
        <FormKit
          name="password"
          type="primePassword"
          validation="required|length:6"
          feedback
          toggleMask
          placeholder="Password"
        />

        <FormKit
          type="primePassword"
          name="password_confirm"
          placeholder="Confirm Password"
          validation="required|confirm"
          toggleMask
        />
      </div>
    </FormWrapper>
    <small class="p-error" v-if="errorMessage">{{ errorMessage }}</small>
  </div>
</template>

<script setup lang="ts">
import { passwordConfirmSchema } from "~~/utils/schemas";
const props = defineProps({
  label: String,
});

const emit = defineEmits(["verified", "error"]);

const isFormValid = ref(false);
const handlePasswordValidationChange = (isValid: boolean) => {
  isFormValid.value = isValid;
};

const form = ref({
  password: "",
  password_confirm: "",
});
const errorMessage = ref("");

const verifyAndProceed = async () => {
  try {
    if (!isFormValid.value) {
      throw new Error("Password is invalid");
    }
    emit("verified", form.value.password);
  } catch (error: any) {
    errorMessage.value = error.message;
    emit("error", error.message);
  }
};

defineExpose({
  verifyAndProceed,
});
</script>
