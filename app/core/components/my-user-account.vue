<template>
  <div>
    <div class="mt-5">
      <h2 class="text-db-h2">Your account</h2>

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
                    :disabled="userSession.provider !== 'email' || isLoading"
                  >
                  </FormKit>
                </div>
                <div class="col-span-2">
                  <FormKit
                    class="w-full"
                    type="primeInputText"
                    name="phone"
                    validation="number"
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
            <h2 class="text-base font-semibold leading-7">Your user handle</h2>
            <p class="mt-1 text-sm leading-6">
              Update your user handle under which you will be recognized.
            </p>
          </div>

          <div class="col-span-3 md:col-span-2">
            <FormWrapper
              :handleSubmit="onNicknameUpdate"
              submit-label="Update Nickname"
              :disabled="isLoading || !isNicknameValid"
            >
              <div class="space-y-3 mb-4">
                <AppInputNickname
                  v-model="userDetails.nickname"
                  :isSubmitted="isLoading"
                  @nicknameValidityChange="handleNicknameValidityChange"
                />
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
                  type="primePassword"
                  name="currentpassword"
                  validation="required"
                  toggleMask
                  :feedback="false"
                  placeholder="Current password"
                />
                <FormKit
                  type="primePassword"
                  name="password"
                  validation="required"
                  toggleMask
                  :feedback="true"
                  placeholder="Password"
                >
                </FormKit>
                <FormKit
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

<script lang="ts" setup>
import PasswordActionConfirm from "@/core/components/utils/forms/password-action-confirm.vue";
import AppInputNickname from "~/core/components/utils/forms/inputs/app-input-nickname.vue";

const { changeUserPassword, verifyPassword, terminateSession } =
  useAuthentication();
const { submit, error } = useForm();
const { showToast } = useToastService();
const userStore = useUserStore();
userStore.fetchUser();
const userSession = await userStore.getUser;
const localePath = useLocalePath();
const userDetails = ref({
  firstname: userStore.firstName,
  lastname: userStore.lastName,
  email: userSession?.email,
  phone: userSession?.phone,
  nickname: userSession?.nickname || "",
});
let initialUserDetails = JSON.parse(JSON.stringify(userDetails.value));
const isLoading = ref(false);

interface FormData {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: number;
  currentpassword?: string;
  password_confirm?: string;
}

const isNicknameValid = ref(true);

const handleNicknameValidityChange = (isValid: boolean) => {
  isNicknameValid.value = isValid;
};

const onNicknameUpdate = async () => {
  if (!isNicknameValid.value) {
    showToast({
      severity: "error",
      summary: "Invalid Nickname",
      detail: "Please enter a valid and unique nickname.",
    });
    return;
  }

  isLoading.value = true;
  try {
    await submit({
      action: () =>
        userStore.updateUserAccount({ nickname: userDetails.value.nickname }),
      successMessage: "Nickname successfully updated",
    });
  } catch (error) {
    console.error("Error updating nickname:", error);
    showToast({
      severity: "error",
      summary: "Nickname update failed",
      detail: "An error occurred while updating your nickname.",
    });
  } finally {
    isLoading.value = false;
  }
};

const onProfileSave = async (data: FormData) => {
  isLoading.value = true;
  try {
    const name = `${data.firstname} ${data.lastname}`;
    const { email, phone } = data;

    if (
      initialUserDetails.firstname !== data.firstname ||
      initialUserDetails.lastname !== data.lastname ||
      initialUserDetails.phone !== data.phone
    ) {
      await submit({
        action: () => userStore.updateUserAccount({ name, phone }),
        successMessage: "User profile successfully updated",
      });
    }

    if (initialUserDetails.email !== data.email) {
      await submit({
        async action() {
          await userStore.updateUserEmail(email, `${window.location.origin}`);
        },
        successMessage: `To change the email, click on the verification link sent to ${email}`,
      });
    }
    initialUserDetails = JSON.parse(JSON.stringify(userDetails.value));
  } catch (error) {
    console.error("Error updating profile:", error);

    showToast({
      severity: "error",
      summary: "Profile update failed",
      detail: "An error occurred while updating your profile.",
    });
  } finally {
    isLoading.value = false;
  }
};

const onPasswordChange = async (data: FormData) => {
  const { currentpassword, password_confirm } = data;
  submit({
    action: async () =>
      await changeUserPassword(currentpassword, password_confirm),
    successMessage: "Your password has been changed",
    errorTitle: "Password update failed",
  });
};

const onTerminateSession = async (data: FormData) => {
  const { currentpassword } = data;
  submit({
    action: async () => {
      await verifyPassword(currentpassword);
    },
    errorTitle: "Password incorrect",
    showSuccessToast: false,
  });

  submit({
    async action() {
      await terminateSession("others");
    },
    successMessage: "Your sessions have been terminated successfully",
    successTitle: "Other sessions terminated",
  });
};
const { confirmAction } = useConfirmAction();

const confirmDeleteAccount = () => {
  confirmAction({
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
      submit({
        async action() {
          await userStore.deleteUserAccount();
        },
        successTitle: "Account deleted",
        successMessage:
          "Account has been deleted, refresh the page to complete the action",
      });
    },
    reject: () => {
      showToast({
        severity: "warn",
        summary: "Cancelled",
        detail: "Action cancelled",
      });
    },
    onError: (errorMessage: string) => {
      showToast({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
      });
    },
  });
};
</script>

<style></style>
