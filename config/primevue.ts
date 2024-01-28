// config/primevue.ts
export default {
    importPT: { from: "@/assets/primevue/lara", as: "Lara" }, //import and apply preset
    options: {
        ripple: false,
        // inputStyle: "outlined",
        // cssLayerOrder: "reset,primevue",
        unstyled: true,
    },
    components: {
        // prefix: "prime", //breaks sfxformkit componenets...
        include: "*",
        // exclude: ['Galleria', 'Carousel'],
    },
    composables: {
        include: "*",
    },
    directives: {
        include: "*",
        // exclude: ['Ripple']
    },
};
