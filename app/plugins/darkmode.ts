import { type Layout } from "~~/types/common";

export default defineNuxtPlugin((nuxtApp) => {
  const { loadFromLocalStorage, updateCurrentLayout, updateHtmlClass } =
    useDarkMode();

  nuxtApp.hook("app:beforeMount", () => {
    loadFromLocalStorage();
  });

  nuxtApp.hook("page:finish", () => {
    const route = useRoute();
    let layout = (route.meta.layout as Layout) || "default";
    if (!["default", "main", "dashboard"].includes(layout)) {
      layout = "default";
    }
    updateCurrentLayout(layout as Layout);
    updateHtmlClass();
  });
});
