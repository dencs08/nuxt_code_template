<template>
  <div>
    <Button @click="standardConfirm" label="Standard Confirm" />
    <Button @click="passwordConfirm" label="Password Confirm" />
  </div>
</template>

<script setup lang="ts">
import PasswordActionConfirm from "../utils/forms/password-action-confirm.vue";

const { showToast } = useToastService();

const { confirmAction } = useConfirmAction();

const standardConfirm = () => {
  confirmAction({
    message: "Are you sure you want to proceed?",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      showToast({
        severity: "success",
        summary: "Confirmed",
        detail: "You have accepted",
      });
    },
    reject: () => {
      showToast({
        severity: "error",
        summary: "Rejected",
        detail: "You have rejected",
      });
    },
  });
};

const passwordConfirm = () => {
  confirmAction({
    message:
      "No longer want to use our service? You can delete your account here. This action is irreversible. All information related to this account will be deleted permanently.",
    header: "Are you sure you want to delete your account?",
    label: "Type your password to delete your account",
    icon: "pi pi-lock",
    acceptLabel: "Delete account",
    rejectLabel: "Cancel",
    severity: "danger",
    component: markRaw(PasswordActionConfirm),
    accept: (password: string) => {
      showToast({
        severity: "success",
        summary: "Confirmed",
        detail: "Password confirmed",
      });
    },
    reject: () => {
      showToast({
        severity: "error",
        summary: "Rejected",
        detail: "Password confirmation cancelled",
      });
    },
  });
};
</script>
