<template>
  <div class="mt-4">
    <TabMenu :model="items" />
    <div class="mt-5">
      <h2 class="text-db-h2">Your profile</h2>
      <NuxtLink :to="localePath('/dashboard/profile/update-password')" class="link-primary">Password reset</NuxtLink>

      <div>
        <div class="grid grid-cols-none gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 class="text-base font-semibold leading-7">Personal Information</h2>
            <p class="mt-1 text-sm leading-6">Here you can access all of your account information and update
              it.</p>
          </div>

          <div class="col-span-3 md:col-span-2">
            <FormWrapper :handleSubmit="submitForm" :submit-attrs="{ inputClass: 'w-full btn-primary' }"
              submit-label="Save">
              <template #default="{ getNode }">
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="col-span-2">
                    <nuxt-img src="https://primefaces.org/cdn/primevue/images/organization/walter.jpg"
                      class="h-auto w-28 rounded"></nuxt-img>
                    <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000"
                      @upload="onUpload" chooseLabel="Avatar" :pt="{
                        content: { class: 'surface-ground' },
                        button: { class: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' },
                        input: { class: 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' }
                      }" />
                  </div>
                  <FormKit class="w-full" type='primeInputText' name='firstname' validation='required'
                    placeholder='First name' @node="getNode">
                  </FormKit>
                  <FormKit class="w-full" type='primeInputText' name='lastname' validation='required'
                    placeholder='Last name' @node="getNode">
                  </FormKit>
                  <div class="col-span-2">
                    <FormKit class="w-full" type='primeInputText' name='email' validation='required|email'
                      placeholder='Email' @node="getNode">
                    </FormKit>
                  </div>
                  <div class="col-span-2">
                    <FormKit class="w-full" type='primeInputNumber' name='phone' validation='required' placeholder='Phone'
                      @node="getNode">
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
            <FormWrapper :handleSubmit="submitForm" :submit-attrs="{ inputClass: 'w-full btn-primary' }"
              submit-label="Change password">
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
            <FormWrapper :handleSubmit="submitForm" :submit-attrs="{ inputClass: 'w-full btn-primary' }"
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
<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

const localePath = useLocalePath()
const userStore = useUsersStore();
const userSession = userStore.getUserSession;

const items = ref([
  {
    label: 'Account',
    icon: 'pi pi-user',
    command: () => {
      // toast.add({ severity: 'success', summary: 'Selected', detail: 'Dashboard', life: 3000 });
    }
  },
  {
    label: 'Actions',
    icon: 'pi pi-chart-line',
    command: () => {
      // toast.add({ severity: 'success', summary: 'Selected', detail: 'Transactions', life: 3000 });
    }
  },
]);

const submitForm = async (data: any) => {
  // const response = await handleSubmit(userStore.addUser, data, 'User successfully added');
}

const onUpload = (event: any) => {
  // toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
}

const { confirmAction } = useConfirmation();
const confirmDeleteAccount = () => {
  confirmAction(async () => {
    console.log('tst');
  },
    {
      header: 'Do you want to delete your account?',
      message: 'No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently. ',
      severity: ConfirmationSeverity.Danger,
    }, ConfirmationGroup.PasswordConfirm);
};
</script>
<style lang="">
    
</style>