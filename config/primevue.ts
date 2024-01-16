// config/primevue.ts
export default {
    options: {
        ripple: true,
        // inputStyle: "outlined",
        // cssLayerOrder: "reset,primevue",
        unstyled: true,
    },
    importPT: { from: "@/assets/primevue/lara" }, //import and apply preset
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
