<template>
  <div class="flex flex-row gap-3 md:gap-1">
    <div v-for="item in socialMenu" :key="item.label">
      <a
        :href="item.href"
        class="text-gray-400 hover:text-primary-500 hover:scale-110 transition-all"
      >
        <span class="sr-only">{{ item.label }}</span>
        <Icon
          :name="item.icon"
          class="h-8 md:h-6 w-auto text-gray-400 hover:text-primary-400 hover:scale-105 transistion"
        />
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { socialMenu } = useNavigation();
</script>

<style></style>
