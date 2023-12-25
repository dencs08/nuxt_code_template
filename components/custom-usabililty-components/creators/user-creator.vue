<template>
    <div>
        <Button icon="pi pi-external-link" @click="visible = true">Add User</Button>

        <Dialog v-model:visible="visible" modal header="Header" :style="{ width: '50rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
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
                            <FormKit class="w-full" type='primeDropdown' :options="roles" optionLabel="role"
                                placeholder="Select user role" validation='required' @node="getNode"></FormKit>
                        </div>
                    </template>
                </FormWrapper>

            </div>
        </Dialog>

    </div>
</template>

<script setup>
import { useUsersStore } from "~/stores/UsersStore";
const { handleSubmit } = useSubmit();
const userStore = useUsersStore();

const visible = ref(false);
const roles = ref([
    { role: 'User' },
    { role: 'Admin' },
]);

const submitForm = async (data) => {
    console.log(data);
    // await handleSubmit(userStore.addUser, { data }, 'User successfully added');
}
</script>
