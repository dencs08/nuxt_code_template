<!-- utils/forms/password-action-confirm.vue -->
<template>
  <div>
    <p class="text-xs mb-1">{{ label }}</p>
    <Password
      class="w-full"
      v-model="password"
      placeholder="Password"
      toggleMask
      :feedback="false"
    />
    <small class="p-error" v-if="errorMessage">{{ errorMessage }}</small>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: String,
});

const emit = defineEmits(["verified", "error"]);

const { verifyPassword } = useAuthentication();

const password = ref("");
const errorMessage = ref("");

const verifyAndProceed = async () => {
  try {
    await verifyPassword(password.value);
    emit("verified", password.value);
  } catch (error: any) {
    errorMessage.value = error.message;
    emit("error", error.message);
  }
};

defineExpose({
  verifyAndProceed,
});
</script>
