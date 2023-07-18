<template>
    <img :src="logoPath" alt="Logo" />
</template>

<script setup lang="ts">
const props = defineProps({
    type: {
        type: String,
        default: 'default',
    },
    color: {
        type: String,
        default: 'color',
    },
});

const allowedColors = ['black', 'white', 'color'];
const allowedTypes = ['logo', 'symbol', 'logotype'];

const logoPath = computed(() => {
    const color = allowedColors.includes(props.color) ? props.color : 'color';
    const type = allowedTypes.includes(props.type) ? props.type : 'logo';

    // noviva uses different naming convention for logo files thus this if statement
    if (type === 'logotype') {
        return `/img/logos/color_logotype_${color}.svg`;
    }

    return `/img/logos/${color}_${type}.svg`;
});
</script>