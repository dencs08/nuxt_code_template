<template>
  <div>
    <div class="mt-5">
      <h2 class="text-db-h2">Your account</h2>
      <!-- TODO Add a way of accessing the update-password after the user requests one in the forgot password but restrict from accessing if not requested -->

      <div>
        <div
          class="grid grid-cols-none gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8"
        >
          <div>
            <h2 class="text-base font-semibold leading-7">
              Personal Information
            </h2>
            <p class="mt-1 text-sm leading-6">
              Here you can access all of your account information and update it.
            </p>
          </div>

          <div class="col-span-3 md:col-span-2">
            <div class="flex items-center gap-6 mb-4">
              <ProfileAvatar class="w-28 h-28" :photo="userStore.user.photo" />
              <div class="space-y-3">
                <AvatarUpload />
                <p
                  class="text-surface-700/70 dark:text-surface-100/70 text-sm font-medium"
                >
                  JPG, JPEG, or PNG. 1MB max.
                </p>
              </div>
            </div>
            <FormWrapper
              :resetOnSubmit="false"
              :handleSubmit="onProfileSave"
              submit-label="Save"
            >
              <div class="grid grid-cols-2 gap-4 mb-4">
                <FormKit
                  class="w-full"
                  type="primeInputText"
                  name="firstname"
                  validation="required"
                  placeholder="First name"
                  v-model="userDetails.firstname"
                >
                </FormKit>
                <FormKit
                  class="w-full"
                  type="primeInputText"
                  name="lastname"
                  validation="required"
                  placeholder="Last name"
                  v-model="userDetails.lastname"
                >
                </FormKit>
                <div class="col-span-2">
                  <FormKit
                    class="w-full"
                    type="primeInputText"
                    name="email"
                    validation="required|email"
                    placeholder="Email"
                    v-model="userDetails.email"
                    :disabled="userSession.provider !== 'email'"
                  >
                  </FormKit>
                </div>
                <div class="col-span-2">
                  <FormKit
                    class="w-full"
                    type="primeInputText"
                    name="phone"
                    validation="required|number"
                    placeholder="Phone"
                    v-model="userDetails.phone"
                  >
                  </FormKit>
                </div>
              </div>
            </FormWrapper>
          </div>

          <Divider class="col-span-3 my-12" />

          <div>
            <h2 class="text-base font-semibold leading-7">Change password</h2>
            <p class="mt-1 text-sm leading-6">
              Update your password associated with your account.
            </p>
          </div>

          <div class="col-span-3 md:col-span-2">
            <FormWrapper
              :handleSubmit="onPasswordChange"
              submit-label="Change password"
            >
              <div class="space-y-3 mb-4">
                <FormKit
                  class="w-full"
                  type="primePassword"
                  name="currentpassword"
                  validation="required"
                  toggleMask
                  :feedback="false"
                  placeholder="Current password"
                />
                <FormKit
                  class="w-full"
                  type="primePassword"
                  name="password"
                  validation="required"
                  toggleMask
                  :feedback="true"
                  placeholder="Password"
                >
                </FormKit>
                <FormKit
                  class="w-full"
                  type="primePassword"
                  name="password_confirm"
                  validation="required|confirm"
                  toggleMask
                  placeholder="Repeat password"
                >
                </FormKit>
              </div>
            </FormWrapper>
          </div>

          <Divider class="col-span-3 my-12" />

          <div>
            <h2 class="text-base font-semibold leading-7">
              Log out other sessions
            </h2>
            <p class="mt-1 text-sm leading-6">
              Please enter your password to confirm you would like to log out of
              your other sessions across all of your devices.
            </p>
          </div>

          <div class="col-span-3 md:col-span-2">
            <FormWrapper
              :handleSubmit="onTerminateSession"
              submit-label="Log out"
            >
              <div class="space-y-3 mb-4">
                <FormKit
                  class="w-full"
                  type="primePassword"
                  name="currentpassword"
                  validation="required"
                  toggleMask
                  :feedback="false"
                  placeholder="Current password"
                />
              </div>
            </FormWrapper>
          </div>

          <Divider class="col-span-3 my-12" />

          <div class="col-span-3 md:col-span-2">
            <div class="flex flex-col gap-2">
              <h2 class="text-base font-semibold leading-7">Delete account</h2>
              <p class="text-sm leading-6">
                No longer want to use our service? You can delete your account
                here. This action is not reversible. All information related to
                this account will be deleted permanently.
              </p>

              <Button
                size="small"
                label="Yes, delete my account"
                severity="danger"
                class="max-w-[220px] mt-4"
                @click="confirmDeleteAccount"
              >
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import PasswordActionConfirm from "@/components/utils/forms/password-action-confirm.vue";

definePageMeta({
  layout: "dashboard",
});

const { changeUserPassword, verifyPassword, terminateSession } =
  useAuthentication();
const { updateUserAccount, updateUserEmail } = await useUser();
const { handleSubmit } = useSubmit();
const { addToast } = useToastService();
const { confirmAction } = useConfirmation();
const { deleteUserAccount } = useUser();
const { emailRequestChangePage } = useRedirections();
const userStore = useUserStore();
userStore.fetchUser();
const userSession = await userStore.getUser;
const localePath = useLocalePath();
const userDetails = ref({
  firstname: userStore.firstName,
  lastname: userStore.lastName,
  email: userSession?.email,
  phone: userSession?.phone,
});
let initialUserDetails = JSON.parse(JSON.stringify(userDetails.value));

interface FormData {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: number;
  currentpassword?: string;
  password_confirm?: string;
}

const onProfileSave = async (data: FormData) => {
  const name = `${data.firstname} ${data.lastname}`;
  const { email, phone } = data;

  if (
    initialUserDetails.firstname !== data.firstname ||
    initialUserDetails.lastname !== data.lastname ||
    initialUserDetails.phone !== data.phone
  ) {
    await handleSubmit(
      updateUserAccount,
      { name, phone },
      "User profile successfully updated"
    );
  }

  if (initialUserDetails.email !== data.email) {
    const emailChangePage = emailRequestChangePage();
    await updateUserEmail(email, `${window.location.origin}${emailChangePage}`);
  }
  initialUserDetails = JSON.parse(JSON.stringify(userDetails.value));
};

const onPasswordChange = async (data: FormData) => {
  const { currentpassword, password_confirm } = data;
  try {
    await changeUserPassword(currentpassword, password_confirm);
    addToast("success", "Password changed", "Your password has been changed.");
  } catch (error: any) {
    addToast("error", "Password update failed", error.message);
  }
};

const onTerminateSession = async (data: FormData) => {
  const { currentpassword } = data;
  try {
    await verifyPassword(currentpassword);
    await terminateSession("others");
    addToast(
      "success",
      "Other sessions terminated",
      "Your sessions have been terminated successfully",
      30000
    );
  } catch (error: any) {
    addToast("error", "Session termination failed", error.message);
  }
};
const { show } = useGlobalDialog();

const confirmDeleteAccount = () => {
  show({
    message:
      "No longer want to use our service? You can delete your account here. This action is irreversible. All information related to this account will be deleted permanently.",
    header: "Are you sure you want to delete your account?",
    label: "Type your password to delete your account",
    icon: "pi pi-exclamation-triangle",
    acceptLabel: "Delete Account",
    rejectLabel: "Cancel",
    severity: "danger",
    component: markRaw(PasswordActionConfirm),
    accept: async () => {
      await deleteUserAccount();
      addToast(
        "success",
        "Account deleted",
        "Account has been deleted, you will be logged out automatically."
      );
    },
    reject: () => {
      addToast("warn", "Cancelled", "Action cancelled");
    },
    onError: (errorMessage: string) => {
      addToast("warn", "Error", errorMessage);
    },
  });
};
</script>
<style lang=""></style>
