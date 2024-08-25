export default defineNuxtRouteMiddleware((to) => {
  //   const darkModeStore = useDarkModeStore();
  //   // Determine the current layout
  //   let currentLayout = "default";
  //   if (to.meta.layout) {
  //     currentLayout = to.meta.layout as string;
  //   }
  //   console.log("dashboard: ", darkModeStore.darkModeSettings.dashboard);
  //   console.log("main: ", darkModeStore.darkModeSettings.main);
  //   console.log("default: ", darkModeStore.darkModeSettings.default);
  //   // Update the current section in the dark mode store
  //   switch (currentLayout) {
  //     default:
  //       darkModeStore.updateCurrentSection("default");
  //       break;
  //     case "main":
  //       darkModeStore.updateCurrentSection("main");
  //       break;
  //     case "dashboard":
  //       darkModeStore.updateCurrentSection("dashboard");
  //       break;
  //   }
});
