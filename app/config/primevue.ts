// config/primevue.ts
export default {
    // importPT: { from: "@/assets/primevue/lara", as: "Lara" }, //import and apply preset
    autoImport: true,
    importTheme: { from: '@/assets/primevue/app-theme.js' },
    options: {
        ripple: false,
        unstyled: false,
        cssLayer: {
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities'
        },
        // inputStyle: "outlined",
    },
    // components: {
    //     // prefix: "prime", //breaks sfxformkit componenets...
    //     // include: "*",
    //     exclude: ['AutoComplete', 'CascadeSelect', 'ColorPicker', 'Knob', 'Galleria', 'TreeTable', 'PickList','DataView', 'OrderList', 'OrganizationChart'],
    // },
    // composables: {
    //     // include: "*",
    // },
    // directives: {
    //     // include: "*",
    //     // exclude: ['Ripple']
    // },
};
