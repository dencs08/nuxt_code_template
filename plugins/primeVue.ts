import PrimeVue from "primevue/config";
import PrimeCalendar from 'primevue/calendar';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: true });
    nuxtApp.vueApp.component("PrimeCalendar", PrimeCalendar);
});
