import type { Pinia } from "pinia";
import { useUsersStore } from "~/stores/UsersStore";

//TODO get the all of the users settings + darkmode

/**
 * Nuxt plugin which gets all the necessary data before the application is created.
 * @param {object} nuxtApp - The Nuxt application instance.
 */
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook("app:beforeMount", async () => {
        const usersStore = useUsersStore(nuxtApp.$pinia as Pinia);
        await usersStore.fetchUserSession();
    });
});
