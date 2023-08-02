<script setup lang="ts">
const localePath = useLocalePath()

const {updatePassword} = useAuthentication();

const password = ref(null);
const repeat = ref(null);
const errorMessage = ref(null);

async function handleSubmit() {
  if(password.value !== repeat.value) {
    errorMessage.value = "Passwords do not match!";
    return;
  }
  try {
    await updatePassword(password.value);
    errorMessage.value = null;
    console.log('success')
  } catch (error) {
    // addToast({ message: error.message, duration: 3000, type: 'danger' });
    console.log(error)
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 h-full">
    <div>
      <h1 class="text-clamp-3xl md:text-clamp-xl">Update your password</h1>
    </div>

    <div class="space-y-3">
      <form action="#" @submit.prevent="handleSubmit" class="space-y-3 mb-2 w-full">
        <Password id="password" v-model="password" inputClass="w-full" class="w-full" placeholder="New password" toggleMask />
        <Password id="repeat" v-model="repeat" inputClass="w-full" class="w-full" placeholder="Repeat new password" :feedback="false" />
        <p v-if="errorMessage" class="text-red-500">{{errorMessage}}</p>
        <Button styling="dark" class="w-full" submit>Reset password</Button>
      </form>
      <NuxtLink :to="localePath('/login')" class="flex items-center justify-center gap-1 text-gray-600 text-sm group">
        <Icon name="ic:round-arrow-back" class="h-auto w-5 group-hover:-translate-x-1 transition-transform duration-150"/>
        <span>Back to log in</span>
      </NuxtLink>
    </div>
  </div>
</template>
