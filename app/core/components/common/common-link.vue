<template>
  <nuxt-link
    class="cursor-pointer"
    :to="to"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :class="[
      'common-link',
      `common-link--${variant}`,
      `common-link--${size}`,
      {
        'common-link--underline': underline,
        'common-link--bold': bold,
        'common-link--disabled': disabled,
      },
      customClass,
    ]"
    @click="handleClick"
  >
    <slot></slot>
  </nuxt-link>
</template>

<script setup lang="ts">
interface Props {
  to: string;
  external?: boolean;
  underline?: boolean;
  bold?: boolean;
  disabled?: boolean;
  variant?: "default" | "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  to: "/",
  external: false,
  underline: false,
  bold: false,
  disabled: false,
  variant: "default",
  size: "md",
  customClass: "",
});

const emit = defineEmits(["click"]);

const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault();
    return;
  }
  emit("click", event);
};
</script>

<style lang="scss" scoped>
.common-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  transition: all 0.3s ease;

  &__text {
    // margin: 0 0.25em;
  }

  &--underline {
    text-decoration: underline;
  }

  &--bold {
    font-weight: bold;
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--sm {
    font-size: 0.875rem;
  }

  &--md {
    font-size: 1rem;
  }

  &--lg {
    font-size: 1.25rem;
  }

  &--default {
    color: var(--p-primary-500);

    &:hover {
      color: var(--p-primary-600);
    }
  }

  &--primary {
    color: var(--p-primary-500);

    &:hover {
      color: var(--p-primary-600);
    }
  }

  &--secondary {
    color: var(--p-secondary-500);

    &:hover {
      color: var(--p-secondary-600);
    }
  }
}
</style>
