<template>
    <div>
      <h2 class="text-db-h2">Your profile</h2>
      <NuxtLink :to="localePath('/dashboard/profile/update-password')" class="link-primary">Password reset</NuxtLink>

      <div v-if="user !== null">
        <pre>{{ user }}</pre>
        <pre>{{ activity }}</pre>
      </div>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    layout: "dashboard",
});

const localePath = useLocalePath()
const {fetchUser} = useUser();

const client = useSupabaseClient()
const activity = ref(null);
const user = ref(null)

onMounted(async ()=>{
  // user.value = await fetchUser();
  user.value = await client.from("users").select("*");

  activity.value = await client.from("userActivity").select("*");
})
</script>
<style lang="">
    
</style>