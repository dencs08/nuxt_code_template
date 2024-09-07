<template>
  <div class="flex flex-wrap">
    <!-- Login Form -->
    <div class="w-full md:w-1/2 p-4">
      <Card>
        <template #title>
          <div class="flex items-center">
            <i class="pi pi-user mr-2"></i>
            <span>Login</span>
          </div>
        </template>
        <template #content>
          <form @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label for="email" class="block mb-2">Email</label>
              <InputText id="email" v-model="email" class="w-full" />
            </div>
            <div class="mb-4">
              <label for="password" class="block mb-2">Password</label>
              <Password
                id="password"
                v-model="password"
                class="w-full"
                toggleMask
              />
            </div>
            <Button type="submit" label="Sign In" class="w-full" />
          </form>
        </template>
      </Card>
    </div>

    <!-- Theme Customizer -->
    <div class="w-full md:w-1/2 p-4">
      <Card>
        <template #title>
          <div class="flex items-center">
            <i class="pi pi-palette mr-2"></i>
            <span>Theme Customizer</span>
          </div>
        </template>
        <template #content>
          <div class="mb-4">
            <label class="block mb-2">Primary Color</label>
            <ColorPicker v-model="primaryColor" @change="updatePrimaryColor" />
          </div>
          <div class="mb-4">
            <label class="block mb-2">Surface Color</label>
            <ColorPicker v-model="surfaceColor" @change="updateSurfaceColor" />
          </div>
          <div class="mb-4">
            <label class="block mb-2">Border Radius</label>
            <Slider
              v-model="borderRadius"
              :min="0"
              :max="20"
              @change="updateBorderRadius"
            />
            <span>{{ borderRadius }}px</span>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  usePreset,
  updatePreset,
  updatePrimaryPalette,
  updateSurfacePalette,
  palette,
} from "@primevue/themes";
import Noir from "@/core/assets/primevue/app-theme";
import theme from "~~/config/common/theme";

const email = ref("");
const password = ref("");
const primaryColor = ref(theme.colors.primary);
const surfaceColor = ref(theme.colors.surface);
const borderRadius = ref(parseInt(theme.borderRadius.md));

const handleSubmit = () => {
  console.log("Form submitted", {
    email: email.value,
    password: password.value,
  });
};

const updatePrimaryColor = () => {
  const newPalette = palette(primaryColor.value);
  updatePrimaryPalette(newPalette);
};

const updateSurfaceColor = () => {
  const newPalette = palette(surfaceColor.value);
  updateSurfacePalette(newPalette);
};

const updateBorderRadius = () => {
  updatePreset({
    primitive: {
      borderRadius: {
        none: `0px`,
        xs: `${borderRadius.value}px`,
        sm: `${borderRadius.value * 1.25}px`,
        md: `${borderRadius.value * 1.5}px`,
        lg: `${borderRadius.value * 2}px`,
        xl: `${borderRadius.value * 2.5}px`,
      },
    },
  });
};

// Initialize theme
usePreset(Noir.preset);
</script>
