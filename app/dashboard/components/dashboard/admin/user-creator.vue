<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    maximizable
    header="Header"
    :style="{ width: '25rem' }"
    :breakpoints="{ '1199px': '40vw', '575px': '50vw' }"
    position="bottomleft"
  >
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
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
            :type="'primeInputText' as any"
            name="email"
            validation="required|email"
            placeholder="Email"
          />
          <FormKit
            class="w-full"
            :type="'primeInputText' as any"
            name="name"
            validation="required|length:3"
            placeholder="Name"
          />
          <FormKit
            class="w-full"
            :type="'primePassword' as any"
            name="password"
            validation="required|length:6"
            toggleMask
            :feedback="true"
            placeholder="Password"
          />
          <FormKit
            class="w-full"
            :type="'primePassword' as any"
            name="password_confirm"
            validation="required|confirm"
            toggleMask
            placeholder="Repeat password"
          />
          <FormKit
            class="w-full"
            :type="'primeSelect' as any"
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
</template>

<script setup lang="ts">
import { userSchema } from "~~/utils/schemas";
import type { UserForm } from "~~/types/user";
import { useUsersStore, type AddUserRequest } from "@/auth/stores/UsersStore";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:visible", "userCreated"]);

const { submit, error } = useForm();
const usersStore = useUsersStore();
const rolesStore = useRolesStore();
const { roles } = storeToRefs(rolesStore);

const rolesOptions = computed(() =>
  roles.value.map((role) => ({ name: role.name, id: role.id }))
);

const submitForm = async (formData: UserForm) => {
  const userData: AddUserRequest = {
    email: formData.email,
    name: formData.name,
    password: formData.password,
    role_id: formData.role_id,
  };

  submit({
    action: async () => {
      await usersStore.addUser(userData);
      console.log("User added to store, fetching updated user list");
      await usersStore.fetchUsers({ force: true });
    },
    successMessage: "User successfully added",
    errorMessage: (e) => `${e.message}. Please try again.`,
  })
    .then(() => {
      console.log("User creation successful, closing dialog");
      emit("update:visible", false);
      emit("userCreated");
    })
    .catch((error) => {
      console.error("Error creating user:", error);
    });
};
</script>
