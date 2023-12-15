<template>
    <div>
        <Button class="mr-0 ml-auto mb-3" @click="showForm = !showForm">
            {{ showForm ? 'Close' : 'Add User' }}
        </Button>
        <div v-auto-animate>
            <Card v-if="showForm" class="space-y-3">
                <p>Add new user to the database</p>
                <div class="grid grid-cols-2 gap-4 mb-2">
                    <InputCustom v-model="newUser.name" label="Name" type="text" />
                    <InputCustom v-model="newUser.email" label="Email" type="email" />
                    <InputCustom v-model="newUser.password" label="Password" type="password" />
                    <SelectRole v-model="newUser.role" />
                </div>
                <Button styling="success" @click="addUser(); showForm = false">Create!</Button>
            </Card>
        </div>
    </div>
</template>

<script setup>
let showForm = ref(false)
let newUser = ref({
    name: '',
    email: '',
    password: '',
    role: ''
})

const { createUser, error } = useUsers();
// const { addToast } = useToast();
const addUser = async () => {
    console.log('newUser');
    const response = await createUser(newUser.value);
    if (!error.value) {
        // navigateTo({ name: 'DashboardRecruitmentIndex', params: { id: response.data.id } })
        // addToast({ message: "User created!", type: "success" })
    }
}
</script>
