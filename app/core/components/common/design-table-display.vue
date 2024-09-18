<template>
  <div>
    <div v-for="font in fonts" :key="font" class="mb-10">
      <div v-for="(size, index) in sizes" :key="size">
        <p :class="getFontClass(font, weights[index], size)">
          The quick brown fox jumps over the lazy dog
        </p>
        <p class="text-xs text-dark-900 mb-4">
          {{ `${font}-${weights[index]}-${size}` }}
        </p>
      </div>
    </div>
    <div class="flex gap-2">
      <div v-for="variant in variants" :key="variant" class="flex-1">
        <div
          v-for="color in colors"
          :key="color"
          :class="getColorClass(color, variant)"
          class="h-24 w-full mb-8 relative rounded-md border border-gray-400/25"
        >
          <div class="text-xs text-dark-900 absolute -bottom-5">
            {{ `${color}-${variant}` }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const colors = ["primary", "secondary", "accent", "surface", "light", "dark"];
const variants = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const getColorClass = (color, variant) => `bg-${color}-${variant}`;

const fonts = ["heading", "body", "accent"];
const weights = [
  "thin",
  "extralight",
  "light",
  "normal",
  "medium",
  "semibold",
  "bold",
  "extrabold",
  "black",
];
const sizes = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"];
const getFontClass = (font, weight, size) =>
  `font-${font} font-${weight} text-${size}`;
</script>

<!-- remember to comment this before deploying if not all of those styles even if unused will get bundled into the css -->
<style>
/* in order to make tailwind register classes */
.bg-primary-0 {
}

.bg-primary-50 {
}

.bg-primary-100 {
}

.bg-primary-200 {
}

.bg-primary-300 {
}

.bg-primary-400 {
}

.bg-primary-500 {
}

.bg-primary-600 {
}

.bg-primary-700 {
}

.bg-primary-800 {
}

.bg-primary-900 {
}

.bg-primary-950 {
}

.bg-secondary-0 {
}

.bg-secondary-50 {
}

.bg-secondary-100 {
}

.bg-secondary-200 {
}

.bg-secondary-300 {
}

.bg-secondary-400 {
}

.bg-secondary-500 {
}

.bg-secondary-600 {
}

.bg-secondary-700 {
}

.bg-secondary-800 {
}

.bg-secondary-900 {
}

.bg-secondary-950 {
}

.bg-accent-0 {
}

.bg-accent-50 {
}

.bg-accent-100 {
}

.bg-accent-200 {
}

.bg-accent-300 {
}

.bg-accent-400 {
}

.bg-accent-500 {
}

.bg-accent-600 {
}

.bg-accent-700 {
}

.bg-accent-800 {
}

.bg-accent-900 {
}

.bg-accent-950 {
}

.bg-surface-0 {
}

.bg-surface-50 {
}

.bg-surface-100 {
}

.bg-surface-200 {
}

.bg-surface-300 {
}

.bg-surface-400 {
}

.bg-surface-500 {
}

.bg-surface-600 {
}

.bg-surface-700 {
}

.bg-surface-800 {
}

.bg-surface-900 {
}

.bg-surface-950 {
}

.bg-surface-0 {
}

.bg-surface-50 {
}

.bg-surface-100 {
}

.bg-surface-200 {
}

.bg-surface-300 {
}

.bg-surface-400 {
}

.bg-surface-500 {
}

.bg-surface-600 {
}

.bg-surface-700 {
}

.bg-surface-800 {
}

.bg-surface-900 {
}

.bg-surface-950 {
}

.bg-light-0 {
}

.bg-light-50 {
}

.bg-light-100 {
}

.bg-light-200 {
}

.bg-light-300 {
}

.bg-light-400 {
}

.bg-light-500 {
}

.bg-light-600 {
}

.bg-light-700 {
}

.bg-light-800 {
}

.bg-light-900 {
}

.bg-light-950 {
}

.bg-dark-0 {
}

.bg-dark-50 {
}

.bg-dark-100 {
}

.bg-dark-200 {
}

.bg-dark-300 {
}

.bg-dark-400 {
}

.bg-dark-500 {
}

.bg-dark-600 {
}

.bg-dark-700 {
}

.bg-dark-800 {
}

.bg-dark-900 {
}

.bg-dark-950 {
}
</style>
