<template>
  <div class="relative">
    <FormKit
      type="primeInputText"
      name="nickname"
      placeholder="nickname"
      validation="required|length:3"
      iconPrefix="pi pi-at"
      :disabled="isSubmitted"
      v-model="nickname"
      @input="handleNicknameInput"
      @blur="handleBlur"
    />
    <div
      v-if="isCheckingNickname"
      class="absolute right-2 top-1/2 transform -translate-y-1/2"
    >
      <i class="pi pi-spin pi-spinner" style="font-size: 1rem"></i>
    </div>
  </div>
  <div v-auto-animate class="!mt-0 !pt-0">
    <small v-if="showError" class="text-red-400">
      This nickname is already taken
    </small>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  isSubmitted: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "nicknameValidityChange"]);

const nickname = ref(props.modelValue);
const isNicknameUnique = ref(true);
const isCheckingNickname = ref(false);
const showError = ref(false);
const hasBeenFocused = ref(false);
let nicknameDebounce: NodeJS.Timeout | null = null;

watch(nickname, (newValue) => {
  emit("update:modelValue", newValue);
});

const checkNicknameUniqueness = async (value: string) => {
  if (!value) {
    isNicknameUnique.value = true;
    return;
  }

  isCheckingNickname.value = true;
  isNicknameUnique.value = true;

  try {
    const { data, error } = await useFetch("/api/v1/me/handle/is-unique", {
      method: "POST",
      body: { nickname: value },
    });

    if (error.value) {
      console.error("Error checking nickname:", error.value);
      return;
    }

    isNicknameUnique.value = data.value.data.isUnique;
    showError.value = hasBeenFocused.value && !isNicknameUnique.value;
  } catch (error) {
    console.error("Error checking nickname:", error);
  } finally {
    isCheckingNickname.value = false;
    emit("nicknameValidityChange", isNicknameUnique.value && value.length >= 3);
  }
};

const handleNicknameInput = () => {
  if (nicknameDebounce) {
    clearTimeout(nicknameDebounce);
  }
  nicknameDebounce = setTimeout(() => {
    checkNicknameUniqueness(nickname.value);
  }, 600);
};

const handleBlur = () => {
  hasBeenFocused.value = true;
  if (!isNicknameUnique.value) {
    showError.value = true;
  }
};
</script>

<style></style>
