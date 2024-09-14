import vue from "@vitejs/plugin-vue";

export default defineNitroConfig({
  rollupConfig: {
    plugins: [vue()],
  },

  //   storage: {
  //     db: {
  //       driver: "redis",
  //       /* redis connector options */
  //     },
  //   },
  // Development
  devStorage: {
    // cache: {
    //   driver: "fs",
    //   base: "./data/cache",
    // },
  },
});
