<template>
  <button
    :class="[
      'common-button',
      `common-button--${variant}`,
      `common-button--${size}`,
      {
        'common-button--loading': loading,
        'common-button--block': block,
        'common-button--disabled': disabled || loading,
      },
      customClass,
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="common-button__loader"></span>
    <span v-else class="common-button__content">
      <slot name="icon-left"></slot>
      <span v-if="$slots.default" class="common-button__text">
        <slot></slot>
      </span>
      <slot name="icon-right"></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "sm" | "md" | "lg";
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  customClass?: string;
  loadingDuration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  block: false,
  disabled: false,
  loading: false,
  customClass: "",
  loadingDuration: 0,
});

const emit = defineEmits(["click"]);

const isLoading = ref(props.loading);

const handleClick = async (event: MouseEvent) => {
  if (props.disabled || isLoading.value) return;

  isLoading.value = true;
  emit("click", event);

  if (props.loadingDuration > 0) {
    await new Promise((resolve) => setTimeout(resolve, props.loadingDuration));
  }

  isLoading.value = false;
};
</script>

<style lang="scss" scoped>
.common-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &__content {
    display: flex;
    align-items: center;
  }

  &__text {
    margin: 0 0.25rem;
  }

  &__loader {
    width: 1rem;
    height: 1rem;
    border: 2px solid #ffffff;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  &--primary {
    background-color: var(--primary-color, #007bff);
    color: white;

    &:hover:not(:disabled) {
      background-color: var(--primary-hover-color, #0056b3);
    }
  }

  &--secondary {
    background-color: var(--secondary-color, #6c757d);
    color: white;

    &:hover:not(:disabled) {
      background-color: var(--secondary-hover-color, #5a6268);
    }
  }

  &--outline {
    background-color: transparent;
    border: 1px solid var(--primary-color, #007bff);
    color: var(--primary-color, #007bff);

    &:hover:not(:disabled) {
      background-color: var(--primary-color, #007bff);
      color: white;
    }
  }

  &--text {
    background-color: transparent;
    color: var(--primary-color, #007bff);

    &:hover:not(:disabled) {
      text-decoration: underline;
    }
  }

  &--sm {
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
  }

  &--md {
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }

  &--lg {
    font-size: 1.25rem;
    padding: 0.75rem 1.5rem;
  }

  &--block {
    display: flex;
    width: 100%;
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--loading {
    cursor: wait;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
