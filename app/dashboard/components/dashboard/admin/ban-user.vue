<!-- utils/forms/password-action-confirm.vue -->
<template>
  <div>
    <p class="text-xs mb-1">{{ label }}</p>
    <FormWrapper
      :zodSchema="banDurationSchema"
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
      @validation-change="handleDurationValidate"
    >
      <FormKit
        type="primeInputText"
        name="duration"
        placeholder="Duration"
        validation="required|length:2"
      ></FormKit>
    </FormWrapper>
  </div>
</template>

<script setup lang="ts">
import { banDurationSchema } from "~~/utils/schemas";

const props = defineProps({
  label: String,
});

const emit = defineEmits(["verified", "error"]);

const form = ref({
  duration: "",
});
const errorMessage = ref("");

const isDurationValid = ref(false);
const handleDurationValidate = (isValid: boolean) => {
  if (!isValid) {
    isDurationValid.value = false;
    errorMessage.value = "Please enter a valid duration";
  } else {
    isDurationValid.value = true;
    errorMessage.value = "";
  }
};

const verifyAndProceed = async () => {
  try {
    if (!isDurationValid.value) {
      throw new Error("Please enter a valid duration");
    }

    emit("verified", form.value.duration);
  } catch (error: any) {
    errorMessage.value = error.message;
    emit("error", error.message);
  }
};

defineExpose({
  verifyAndProceed,
});
</script>
