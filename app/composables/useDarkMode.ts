// composables/useDarkMode.ts
import { ref, computed, watch } from "vue";
import { useState, useNuxtApp } from "nuxt/app";
import { type Layout } from "~~/types/common";

export const useDarkMode = () => {
  const nuxtApp = useNuxtApp();
  const darkModeSettings = useState<Record<Layout, boolean>>(
    "darkModeSettings",
    () => ({
      default: false,
      main: false,
      dashboard: false,
    })
  );

  const currentLayout = useState<Layout>("currentLayout", () => "default");
  const isDarkMode = computed(
    () => darkModeSettings.value[currentLayout.value]
  );

  const updateCurrentLayout = (layout: Layout) => {
    currentLayout.value = layout;
    updateHtmlClass();
  };

  const toggleDarkMode = () => {
    darkModeSettings.value = {
      ...darkModeSettings.value,
      [currentLayout.value]: !darkModeSettings.value[currentLayout.value],
    };
    saveToLocalStorage();
    updateHtmlClass();
  };

  const updateHtmlClass = () => {
    if (import.meta.client) {
      if (isDarkMode.value) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const saveToLocalStorage = () => {
    if (import.meta.client) {
      localStorage.setItem(
        "darkModeSettings",
        JSON.stringify(darkModeSettings.value)
      );
    }
  };

  const loadFromLocalStorage = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem("darkModeSettings");
      if (stored) {
        darkModeSettings.value = JSON.parse(stored);
      }
    }
  };

  if (import.meta.client && !nuxtApp.$darkModeInitialized) {
    loadFromLocalStorage();
    updateHtmlClass();
    nuxtApp.$darkModeInitialized = true;
  }

  return {
    currentLayout,
    isDarkMode,
    toggleDarkMode,
    updateCurrentLayout,
    loadFromLocalStorage,
    updateHtmlClass,
  };
};
