<template>
    <div>
        <div>
            <Button label="Add" icon="pi pi-plus" severity="success" @click="visible = true;" />
        </div>

        <Dialog v-model:visible="visible" maximizable header="Header" :style="{ width: '25rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="bottomleft">
            <template #header>
                <div class="inline-flex align-items-center justify-content-center gap-2">
                    <span class="font-bold white-space-nowrap">Create a new user</span>
                </div>
            </template>
            <div class="m-0">

                <FormWrapper :handleSubmit="submitForm" :submit-attrs="{ inputClass: 'w-full btn-primary' }"
                    submit-label="Create">
                    <template #default="{ getNode }">
                        <div class="space-y-2 mb-5">
                            <FormKit class="w-full" type='primeInputText' name='email' validation='required|email'
                                placeholder='Email' @node="getNode">
                            </FormKit>
                            <FormKit class="w-full" type='primeInputText' name='name' validation='required'
                                placeholder='Name' @node="getNode">
                            </FormKit>
                            <FormKit class="w-full" type='primePassword' name='password' validation='required' toggleMask
                                :feedback="true" placeholder='Password' @node="getNode">
                            </FormKit>
                            <FormKit class="w-full" type='primePassword' name='password_confirm'
                                validation='required|confirm' toggleMask placeholder='Repeat password' @node="getNode">
                            </FormKit>
                            <FormKit class="w-full" type='primeDropdown' :options="roles" name="role"
                                placeholder="Select user role" validation='required' @node="getNode"></FormKit>
                            <!-- <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000"
                                @upload="onUpload" chooseLabel="Avatar" /> -->
                        </div>
                    </template>
                </FormWrapper>

            </div>
        </Dialog>
    </div>
</template>

<script setup>
const { handleSubmit } = useSubmit();
const { roles } = useRoles();
const userStore = useUsersStore();
const visible = ref(false);

const submitForm = async (data) => {
    const response = await handleSubmit(userStore.addUser, data, 'User successfully added');
}

</script>
