<template>
  <div>
    <div class="mt-5">
      <h2 class="text-db-h2">Your profile</h2>
      <!-- <NuxtLink :to="localePath('/dashboard/profile/update-password')" class="link-primary">Password reset</NuxtLink> -->

      <div>
        <div class="grid grid-cols-none gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 class="text-base font-semibold leading-7">Personal Information</h2>
            <p class="mt-1 text-sm leading-6">Here you can access all of your account information and update
              it.</p>
          </div>

          <div class="col-span-3 md:col-span-2">
            <div class="flex items-center gap-6 mb-4">
              <ProfileAvatar class="w-28 h-28" :photo="userStore.userSession.photo" />
              <div class="space-y-3">
                <AvatarUpload />
                <p class="text-surface-700/70 dark:text-surface-100/70 text-sm font-medium">JPG, JPEG, or PNG. 1MB
                  max.</p>
              </div>
            </div>
            <FormWrapper :handleSubmit="onProfileSave" :submit-attrs="{ inputClass: 'w-full btn-primary' }"
              submit-label="Save">
              <template #default="{ getNode }">
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <FormKit class="w-full" type='primeInputText' name='firstname' validation='required'
                    placeholder='First name' v-model="userDetails.firstname">
                  </FormKit>
                  <FormKit class="w-full" type='primeInputText' name='lastname' validation='required'
                    placeholder='Last name' v-model="userDetails.lastname">
                  </FormKit>
                  <div class="col-span-2">
                    <FormKit class="w-full" type='primeInputText' name='email' validation='required|email'
                      placeholder='Email' v-model="userDetails.email" :disabled="userSession.provider !== 'email'">
                    </FormKit>
                  </div>
                  <div class="col-span-2">
                    <FormKit class="w-full" type='primeInputNumber' name='phone' validation='required|number'
                      placeholder='Phone' v-model="userDetails.phone">
                    </FormKit>
                  </div>
                </div>
              </template>
            </FormWrapper>
          </div>

          <Divider class="col-span-3 my-12" />

          <div>
            <h2 class="text-base font-semibold leading-7">Change password</h2>
            <p class="mt-1 text-sm leading-6">Update your password associated with your account.</p>
          </div>

          <div class="col-span-3 md:col-span-2">
            <FormWrapper :handleSubmit="onPasswordChange" :submit-attrs="{ inputClass: 'w-full btn-primary' }"
              submit-label="Change password" :disabled="userSession.provider !== 'email'">
              <template #default="{ getNode }">
                <div class="space-y-3 mb-4">
                  <FormKit class="w-full" type='primePassword' name='currentpassword' validation='required' toggleMask
                    :feedback="false" placeholder='Current password' @node="getNode" />
                  <FormKit class="w-full" type='primePassword' name='password' validation='required' toggleMask
                    :feedback="true" placeholder='Password' @node="getNode">
                  </FormKit>
                  <FormKit class="w-full" type='primePassword' name='password_confirm' validation='required|confirm'
                    toggleMask placeholder='Repeat password' @node="getNode">
                  </FormKit>
                </div>
              </template>
            </FormWrapper>
          </div>

          <Divider class="col-span-3 my-12" />

          <div>
            <h2 class="text-base font-semibold leading-7">Log out other sessions</h2>
            <p class="mt-1 text-sm leading-6">Please enter your password to confirm you would like to log
              out of your other sessions across all of your devices.</p>
          </div>

          <div class="col-span-3 md:col-span-2">
            <FormWrapper :handleSubmit="onTerminateSession" :submit-attrs="{ inputClass: 'w-full btn-primary' }"
              submit-label="Log out">
              <template #default="{ getNode }">
                <div class="space-y-3 mb-4">
                  <FormKit class="w-full" type='primePassword' name='currentpassword' validation='required' toggleMask
                    :feedback="false" placeholder='Current password' @node="getNode" />
                </div>
              </template>
            </FormWrapper>
          </div>

          <Divider class="col-span-3 my-12" />

          <div class="col-span-3 md:col-span-2">
            <div class="flex flex-col gap-2">
              <h2 class="text-base font-semibold leading-7">Delete account</h2>
              <p class="text-sm leading-6">No longer want to use our service? You can delete your
                account
                here. This action is not reversible. All information related to this account will be deleted permanently.
              </p>

              <Button label="Yes, delete my account" severity="danger" class="max-w-[200px] mt-4"
                @click="confirmDeleteAccount">
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  layout: "dashboard",
});

const { changeUserPassword, verifyPassword, terminateSession } = useAuthentication();
const { updateProfile, updateUserEmail } = useUser();
const { handleSubmit } = useSubmit();
const { addToast } = useToastService();
const { confirmAction } = useConfirmation();
const { deleteAccount } = useAccount();
const userStore = useUsersStore();
userStore.fetchUserSession();
const userSession = await userStore.getUserSession;
const localePath = useLocalePath()
const userDetails = ref({
  firstname: userStore.firstName,
  lastname: userStore.lastName,
  email: userSession?.email,
  phone: userSession?.phone,
})
let initialUserDetails = JSON.parse(JSON.stringify(userDetails.value));

const onProfileSave = async (data) => {
  const name = `${data.firstname} ${data.lastname}`;
  const { email, phone } = data;

  if (initialUserDetails.firstname !== data.firstname || initialUserDetails.lastname !== data.lastname || initialUserDetails.phone !== data.phone) {
    await handleSubmit(updateProfile, { name, phone }, 'User profile successfully updated');
  }

  if (initialUserDetails.email !== data.email) {
    await updateUserEmail(email, `${window.location.origin}/dashboard/profile/confirm-email-change/`);
  }
  initialUserDetails = JSON.parse(JSON.stringify(userDetails.value));
}

const onPasswordChange = async (data) => {
  const { currentpassword, password_confirm } = data;
  try {
    await changeUserPassword(currentpassword, password_confirm);
    addToast('success', 'Password updated', 'Your password has been updated successfully')
  } catch (error) {
    addToast('error', 'Password update failed', error.message)
  }
}

const onTerminateSession = async (data) => {
  const { currentpassword } = data;
  try {
    await verifyPassword(currentpassword);
    await terminateSession('others');
    addToast('success', 'Other sessions terminated', 'Your sessions have been terminated successfully', 30000)
  } catch (error) {
    addToast('error', 'Session termination failed', error.message)
  }
}

const confirmDeleteAccount = () => {
  confirmAction(async () => {
    await deleteAccount();
  },
    {
      header: 'Do you want to delete your account?',
      message: 'No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently. ',
      severity: 'error',
      showToastOnAccept: false,
    }, ConfirmationGroup.PasswordConfirm);
};
</script>
<style lang="">
    
</style>