// config/googleFonts.ts
export default {
    families: {
        Inter: [300, 400, 500],
        Poppins: "500..900",
        "Bebas Neue": true,
        // Oswald: true,
        // "Josefin+Sans": true,
        // Raleway: {
        //     wght: [100, 400],
        //     ital: [100],
        // },
        // Montserrat: "200..700",
        // "Crimson Pro": {
        //     wght: "200..900",
        //     ital: "200..700",
        // },
    },

    preconnect: true,
    // prefetch: false,
    // preload: true,
    // useStylesheet: true,

    // download: false, //download css and google sources for your local project
    // overwriting: true, //prevents files from being downloaded more than once
    // outputDir: 'assets', //where to output the downloaded files

    // fontsDir: 'assets/fonts' //Specifies the directory where the fonts will be downloaded. (only use if base64 = false.)
    // fontsPath: 'fonts' //Specifies the path of the fonts within the generated css. (only use if base64 = false.)

    // base64: true,  //encodes the fonts and inject directly into the generated css file.
    // inject: false, //injects the globally generated css
    // stylePath: 'assets/google-fonts.css', //where to output the generated css file
};
