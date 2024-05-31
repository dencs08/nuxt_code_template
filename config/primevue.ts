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
        // include: "*",
        exclude: ['AutoComplete', 'CascadeSelect', 'ColorPicker', 'Knob', 'Galleria', 'TreeTable', 'PickList','DataView', 'OrderList', 'OrganizationChart'],
    },
    composables: {
        // include: "*",
    },
    directives: {
        // include: "*",
        // exclude: ['Ripple']
    },
};
