<template>
  <div>
    <FormWrapper
      :zodSchema="emailSchema"
      :handleSubmit="handleForm"
      :reset-on-submit="true"
      :submitAttrs="{ inputClass: 'btn btn-primary' }"
      submitLabel="Invite"
    >
      <div class="space-y-2 mb-3">
        <FormKit
          class="w-full"
          type="primeInputText"
          name="email"
          validation="required|email"
          placeholder="Email"
        >
        </FormKit>
      </div>
    </FormWrapper>
  </div>
</template>

<script lang="ts" setup>
import { emailSchema } from "~~/utils/schemas";
const usersStore = useUsersStore();
const { submit, error } = useForm();
const handleForm = async (data: any) => {
  await submit({
    async action() {
      await usersStore.inviteUser(data.email);
    },
    successMessage: `${data.email} has been invited successfully`,
    errorTitle: "Error inviting user",
  });
};
</script>

<style></style>
