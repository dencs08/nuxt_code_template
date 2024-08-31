<script setup lang="ts">
const { signInWithOAuth, signInWithOAuthPopup } = useAuthentication();

const socialButtons = ref([
  // {
  //   provider: 'facebook',
  //   backgroundColor: "bg-blue-600",
  //   textColor: "text-white",
  //   focusColor: "#1D9BF0",
  //   icon: "ic:baseline-facebook",
  //   text: "Facebook",
  //   borderColor: null
  // },
  {
    provider: 'google',
    icon: "logos:google-icon",
    text: "Google",
    borderColor: "",
    backgroundColor: "",
    textColor: "",
    focusColor: ""
  },
])

</script>

<template>
  <div class="mt-6 grid grid-cols-1 gap-4">
    <button v-for="button in socialButtons" :key="button.text" :class="[
      'flex w-full items-center justify-center gap-2 rounded-md px-3 py-1.5 btn-light transition-color duration-75',
      button.backgroundColor,
      button.textColor,
      button.borderColor
    ]"
      :style="'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[' + button.focusColor + ']'"
      @click="signInWithOAuth(button.provider)">
      <Icon :name="button.icon" class="h-5 w-auto" />
      <span class="text-sm font-semibold leading-6">{{ button.text }}</span>
    </button>
  </div>
</template>
