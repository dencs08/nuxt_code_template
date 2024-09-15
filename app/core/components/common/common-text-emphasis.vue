<template>
  <component
    :is="tag"
    :class="[
      'common-text-emphasis',
      `common-text-emphasis--${variant}`,
      `common-text-emphasis--${size}`,
      { 'common-text-emphasis--uppercase': uppercase },
      customClass,
    ]"
  >
    <slot></slot>
  </component>
</template>

<script lang="ts" setup>
interface Props {
  tag?: string;
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  uppercase?: boolean;
  customClass?: string;
}

withDefaults(defineProps<Props>(), {
  tag: "span",
  variant: "primary",
  size: "md",
  uppercase: false,
  customClass: "",
});
</script>

<style scoped>
.common-text-emphasis {
  display: inline-block;
  font-weight: bold;
}

.common-text-emphasis--primary {
  color: var(--primary-color, #007bff);
}

.common-text-emphasis--secondary {
  color: var(--secondary-color, #6c757d);
}

.common-text-emphasis--accent {
  color: var(--accent-color, #28a745);
}

.common-text-emphasis--sm {
  font-size: 0.875rem;
}

.common-text-emphasis--md {
  font-size: 1rem;
}

.common-text-emphasis--lg {
  font-size: 1.25rem;
}

.common-text-emphasis--uppercase {
  text-transform: uppercase;
}
</style>
