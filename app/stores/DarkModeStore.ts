import { defineStore } from "pinia";

type Layout = "default" | "main" | "dashboard";

export const useDarkModeStore = defineStore({
  id: "darkModeStore",
  state: () => ({
    darkModeSettings: {
      default: false,
      main: false,
      dashboard: false,
    },
    currentLayout: "default" as Layout,
  }),
  getters: {
    isDarkMode: (state) => state.darkModeSettings[state.currentLayout],
  },
  actions: {
    toggleDarkMode() {
      this.darkModeSettings[this.currentLayout] =
        !this.darkModeSettings[this.currentLayout];
      this.updateHtmlClass();
    },
    updateCurrentSection(layout: Layout) {
      this.currentLayout = layout;
      this.updateHtmlClass();
    },
    updateHtmlClass() {
      if (this.isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
  },
});
