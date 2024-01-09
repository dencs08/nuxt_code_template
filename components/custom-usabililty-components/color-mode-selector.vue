<template>
    <button @click="toggle()">
        <Icon v-auto-animate :name="isDark ? 'ic:outline-dark-mode' : 'ic:outline-light-mode'" class="text-lg" />
    </button>
</template>

<script setup>
const isDark = useDark()
const toggle = useToggle(isDark)
</script>