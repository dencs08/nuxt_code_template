<template>
  <div
    class="border border-surface-500 dark:border-surface-600 rounded overflow-hidden shadow-[0_1px_10px_-1px_rgba(0,0,0,0.5)]"
  >
    <Skeleton
      v-if="(!userSession && !photoSrc) || userStore.loading"
      height="100%"
      width="100%"
      class="object-cover"
    >
    </Skeleton>
    <nuxt-img
      v-else-if="!photoSrc"
      :src="'img/avatar.svg'"
      class="h-full w-full object-cover"
    ></nuxt-img>
    <nuxt-img
      v-else
      :src="photoSrc"
      class="h-full w-full object-cover"
    ></nuxt-img>
  </div>
</template>

<script setup>
const props = defineProps({
  photo: String,
});

const userStore = useUsersStore();
const userSession = await userStore.getUser;
const photoSrc = ref(props.photo || user.photo);

watch(
  () => userStore.user.photo,
  (newPhoto) => {
    photoSrc.value = newPhoto;
  }
);
</script>

<style></style>
