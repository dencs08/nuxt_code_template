<template>
  <div>
    <Button @click="standardConfirm" label="Standard Confirm" />
    <Button @click="passwordConfirm" label="Password Confirm" />
  </div>
</template>

<script setup lang="ts">
import PasswordActionConfirm from "../utils/forms/password-action-confirm.vue";

const { addToast } = useToastService();

const { confirmAction } = useConfirmAction();

const standardConfirm = () => {
  confirmAction({
    message: "Are you sure you want to proceed?",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      addToast("info", "Confirmed", "You have accepted");
    },
    reject: () => {
      addToast("error", "Rejected", "You have rejected");
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
      addToast("info", "Confirmed", "Password confirmed");
    },
    reject: () => {
      addToast("error", "Rejected", "Password confirmation cancelled");
    },
  });
};
</script>
