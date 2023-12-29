// config/primevue.ts

export default {
    options: {
        ripple: true,
        // inputStyle: "outlined", //wont work until primevue tailwind installed (not all components are supported yet) + main.css primevuetheme
        // cssLayerOrder: "reset,primevue",
        unstyled: false,
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
