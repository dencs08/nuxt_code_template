// config/primevue.ts
export default {
  // importPT: { from: "../app/assets/primevue/aura", as: "Aura" }, //passthrough stylings for unstyled mode
  importTheme: { from: "@/assets/primevue/app-theme.js" },
  autoImport: true,
  options: {
    ripple: false,
    unstyled: false,
    // cssLayer: {
    //   name: "primevue",
    //   order: "tailwind-base, primevue, tailwind-utilities",
    // },
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
