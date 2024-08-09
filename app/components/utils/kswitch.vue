<template>
  <div class="h-screen w-screen flex flex-col justify-center items-center">
    <h1>Application has been disabled</h1>
    <h2>
      Contact the support at
      <a class="underline" :href="`mailto:${supportEmail}`">{{
        supportEmail
      }}</a>
    </h2>
  </div>
</template>

<script lang="ts" setup>
const { supportEmail } = useBusiness();
</script>

<style></style>
