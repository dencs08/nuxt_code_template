//! note: when changing this file you need to restart the server it doesnt support hot reload yet.

//extending page hook of nuxt
//useful if want to assign new name to the page, redirect to another page, or change the path.
export const routes = [
    //design pages
    {
        name: "index", //actual page name
        newName: "index", //assign new name
        path: "/", //change the path //TODO check how this works with new i18n path defining per language
        file: "@/pages/index.vue", //specify the file
    },
    {
        name: "contact",
        newName: "contact",
        path: "/contact",
        file: "@/pages/contact.vue",
    },

    //legal pages
    {
        name: "terms-and-conditions",
        newName: "terms",
        path: "/terms",
        file: "@/pages/terms-and-conditions.vue",
    },
    {
        name: "privacy-policy",
        newName: "privacy",
        path: "/privacy",
        file: "@/pages/privacy-policy.vue",
    },
    {
        name: "cookies-policy",
        newName: "cookies",
        path: "/cookies",
        file: "@/pages/cookies-policy.vue",
    },

    //auth pages
    {
        name: "login",
        newName: "login",
        path: "/login",
        file: "@/pages/login.vue",
    },
    {
        name: "register",
        newName: "register",
        path: "/register",
        file: "@/pages/register.vue",
    },
    {
        name: "lost-password",
        newName: "lost-password",
        path: "/lost-password",
        file: "@/pages/lost-password.vue",
    },

    //dashboard pages
    {
        name: "dashboard",
        newName: "dash",
        path: "/dashboard",
        file: "@/pages/dashboard/index.vue",
    },
    {
        name: "dashboard-home",
        newName: "dash-home",
        path: "/dashboard/home",
        file: "@/pages/dashboard/home/index.vue",
    },
    {
        name: "dashboard-mail-inbox",
        newName: "dash-mail-inbox",
        path: "/dashboard/mail/inbox",
        file: "@/pages/dashboard/mail/inbox.vue",
    },

    //dashboard admin pages
    {
        name: "dashboard-admin-users",
        newName: "dash-admin-users",
        path: "/dashboard/admin/users",
        file: "@/pages/dashboard/admin/users/index.vue",
    },
    {
        name: "dashboard-admin-marketing",
        newName: "dash-admin-marketing",
        path: "/dashboard/admin/marketing",
        file: "@/pages/dashboard/admin/marketing/index.vue",
    },
    {
        name: "dashboard-admin-analytics",
        newName: "dash-admin-analytics",
        path: "/dashboard/admin/analytics",
        file: "@/pages/dashboard/admin/analytics/index.vue",
    },
    {
        name: "dashboard-admin-analytics-users",
        newName: "dash-admin-analytics-users",
        path: "/dashboard/admin/analytics/users",
        file: "@/pages/dashboard/admin/analytics/users/index.vue",
    },

    //dashboard user pages
    {
        name: "dashboard-user-account",
        newName: "dash-user-account",
        path: "/dashboard/user/account",
        file: "@/pages/dashboard/user/account/index.vue",
    },
    {
        name: "dashboard-user-profile",
        newName: "dash-user-profile",
        path: "/dashboard/user/profile",
        file: "@/pages/dashboard/user/profile/index.vue",
    },
];
