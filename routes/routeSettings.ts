//env environment variables control global settings for all routes this is file is overriding them for each route
//the name of the route should be the same as newName in routes.ts (if newName is not set, use name)
export const routeSettings = {
    //design pages
    index: { auth: false, access: "" },
    contact: { auth: false, access: "" },

    //legal pages
    faq: { auth: false, access: "" },
    privacy: { auth: false, access: "" },
    cookies: { auth: false, access: "" },
    terms: { auth: false, access: "" },

    //auth pages
    login: {
        auth: {
            unauthenticatedOnly: true,
            navigateAuthenticatedTo: "dash-home",
        },
        access: "",
    },
    register: {
        auth: {
            unauthenticatedOnly: true,
            navigateAuthenticatedTo: "dash-home",
        },
        access: "",
    },
    "lost-password": {
        auth: {
            unauthenticatedOnly: true,
            navigateAuthenticatedTo: "dash-home",
        },
        access: "",
    },

    //main pages
    main: {
        auth: false,
        access: "",
    },
};
