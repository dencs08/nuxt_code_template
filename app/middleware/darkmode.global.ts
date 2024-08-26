import { type Layout } from "~~/types/common";

export default defineNuxtRouteMiddleware((to) => {
  const { updateCurrentLayout } = useDarkMode();
  let layout = (to.meta.layout as Layout) || "default";
  if (!["default", "main", "dashboard"].includes(layout)) {
    layout = "default";
  }
  updateCurrentLayout(layout as Layout);

  console.log("Middleware - Current layout:", layout);
});
