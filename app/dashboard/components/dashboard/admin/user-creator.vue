<template>
  <div>
    <div>
      <Button
        size="small"
        label="Add"
        icon="pi pi-plus"
        severity="success"
        @click="visible = true"
      />
    </div>
    <Dialog
      v-model:visible="visible"
      maximizable
      header="Header"
      :style="{ width: '25rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      position="bottomleft"
    >
      <template #header>
        <div
          class="inline-flex align-items-center justify-content-center gap-2"
        >
          <span class="font-bold white-space-nowrap">Create a new user</span>
        </div>
      </template>
      <div class="m-0">
        <FormWrapper
          :zodSchema="userSchema"
          :handleSubmit="submitForm"
          submitLabel="Create"
        >
          <div class="space-y-2 mb-5">
            <FormKit
              class="w-full"
              type="primeInputText"
              name="email"
              validation="required|email"
              placeholder="Email"
            />
            <FormKit
              class="w-full"
              type="primeInputText"
              name="name"
              validation="required|length:3"
              placeholder="Name"
            />
            <FormKit
              class="w-full"
              type="primePassword"
              name="password"
              validation="required|length:6"
              toggleMask
              :feedback="true"
              placeholder="Password"
            />
            <FormKit
              class="w-full"
              type="primePassword"
              name="password_confirm"
              validation="required|confirm"
              toggleMask
              placeholder="Repeat password"
            />
            <FormKit
              class="w-full"
              type="primeSelect"
              :options="rolesOptions"
              optionValue="id"
              optionLabel="name"
              name="role_id"
              placeholder="Select user role"
              validation="required"
            />
            <!-- <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000"
                                @upload="onUpload" chooseLabel="Avatar" /> -->
          </div>
        </FormWrapper>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { userSchema } from "~~/utils/schemas";
import type { UserForm } from "~~/types/user";

const { handleSubmit } = useSubmit();
const usersStore = useUsersStore();
const rolesStore = useRolesStore();
const { roles } = storeToRefs(rolesStore);
const visible = ref(false);

const rolesOptions = computed(() =>
  roles.value.map((role) => ({ name: role.name, id: role.id }))
);

const submitForm = async (data: UserForm) => {
  console.log(data);

  const response = await handleSubmit(
    usersStore.addUser,
    data,
    "User successfully added"
  );
  if (response) {
    visible.value = false;
  }
};
</script>
