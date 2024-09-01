export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  components: [
    {
      path: "./components",
      pathPrefix: false,
    },
  ],
});
