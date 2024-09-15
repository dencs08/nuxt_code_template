<template>
  <component
    :is="tag"
    :class="[
      'common-text-muted',
      `common-text-muted--${intensity}`,
      `common-text-muted--${size}`,
      { 'common-text-muted--italic': italic },
      customClass,
    ]"
  >
    <slot></slot>
  </component>
</template>

<script lang="ts" setup>
interface Props {
  tag?: string;
  intensity?: "light" | "medium" | "dark";
  size?: "sm" | "md" | "lg";
  italic?: boolean;
  customClass?: string;
}

withDefaults(defineProps<Props>(), {
  tag: "span",
  intensity: "medium",
  size: "md",
  italic: false,
  customClass: "",
});
</script>

<style scoped>
.common-text-muted {
  display: inline-block;
}

.common-text-muted--light {
  color: var(--muted-light-color, #a0a0a0);
}

.common-text-muted--medium {
  color: var(--muted-medium-color, #808080);
}

.common-text-muted--dark {
  color: var(--muted-dark-color, #606060);
}

.common-text-muted--sm {
  font-size: 0.875rem;
}

.common-text-muted--md {
  font-size: 1rem;
}

.common-text-muted--lg {
  font-size: 1.25rem;
}

.common-text-muted--italic {
  font-style: italic;
}
</style>
