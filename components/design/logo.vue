<template>
  <nuxt-img :src="logoPath" @error="handleImageError" alt="Logo" quality="10" />
</template>

<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    default: 'logo',
  },
  color: {
    type: String,
    default: 'color',
  },
});

const allowedColors = ['black', 'white', 'color'];
const allowedTypes = ['logo', 'symbol'];

const logoPath = ref('');  // Make it a ref so that we can change its value

// Generate the correct path every time props.color or props.type changes
watchEffect(() => {
  const color = allowedColors.includes(props.color) ? props.color : 'color';
  const type = allowedTypes.includes(props.type) ? props.type : 'logo';

  logoPath.value = `/img/logos/${type}_${color}.svg`;
});

// If the image fails to load, change the source to a placeholder
const handleImageError = () => {
  // logoPath.value = '/img/placeholder.jpg';
};
</script>
