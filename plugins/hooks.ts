let i = 0;
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook("page:start", () => {
        console.log("Nuxt App is created!");
        console.log(i);
        i++;
    });
});
