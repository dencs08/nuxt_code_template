//env environment variables control global settings for all routes this file is overriding them for each route
//the name of the route should be the same as newName in routes.ts (if newName is not set, use name)
export const routes = [
  //design pages
  {
    name: "index",
    newName: "index",
    path: "/",
    file: "@/pages/index.vue",
    settings: { auth: false, access: "" },
  },
  {
    name: "contact",
    newName: "contact",
    path: "/contact",
    file: "@/pages/contact.vue",
    settings: { auth: false, access: "" },
  },

  //legal pages
  {
    name: "terms-and-conditions",
    newName: "terms",
    path: "/terms",
    file: "@/pages/terms-and-conditions.vue",
    settings: { auth: false, access: "" },
  },
  {
    name: "privacy-policy",
    newName: "privacy",
    path: "/privacy",
    file: "@/pages/privacy-policy.vue",
    settings: { auth: false, access: "" },
  },
  {
    name: "cookies-policy",
    newName: "cookies",
    path: "/cookies",
    file: "@/pages/cookies-policy.vue",
    settings: { auth: false, access: "" },
  },

  //auth pages
  {
    name: "login",
    newName: "login",
    path: "/login",
    file: "@/pages/login.vue",
    settings: {
      auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: "dash-home",
      },
      access: "",
    },
  },
  {
    name: "register",
    newName: "register",
    path: "/register",
    file: "@/pages/register.vue",
    settings: {
      auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: "dash-home",
      },
      access: "",
    },
  },
  {
    name: "lost-password",
    newName: "lost-password",
    path: "/lost-password",
    file: "@/pages/lost-password.vue",
    settings: {
      auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: "dash-home",
      },
      access: "",
    },
  },
  {
    name: "auth-verify",
    newName: "auth-verify",
    path: "/auth/verify",
    file: "@/pages/auth/verify.vue",
    settings: { auth: false, access: "" },
  },

  //dashboard pages
  {
    name: "dashboard",
    newName: "dash",
    path: "/dashboard",
    file: "@/pages/dashboard/index.vue",
    settings: { auth: true },
  },
  {
    name: "dashboard-home",
    newName: "dash-home",
    path: "/dashboard/home",
    file: "@/pages/dashboard/home/index.vue",
    settings: { auth: true },
  },
  {
    name: "dashboard-mail-inbox",
    newName: "dash-mail-inbox",
    path: "/dashboard/mail/inbox",
    file: "@/pages/dashboard/mail/inbox.vue",
    settings: { auth: true },
  },
  {
    name: "dashboard-admin-users",
    newName: "dash-admin-users",
    path: "/dashboard/admin/users",
    file: "@/pages/dashboard/admin/users/index.vue",
    settings: { auth: true },
  },
  {
    name: "dashboard-admin-marketing",
    newName: "dash-admin-marketing",
    path: "/dashboard/admin/marketing",
    file: "@/pages/dashboard/admin/marketing/index.vue",
    settings: { auth: true },
  },
  {
    name: "dashboard-admin-analytics",
    newName: "dash-admin-analytics",
    path: "/dashboard/admin/analytics",
    file: "@/pages/dashboard/admin/analytics/index.vue",
    settings: { auth: true },
  },
  {
    name: "dashboard-admin-analytics-users",
    newName: "dash-admin-analytics-users",
    path: "/dashboard/admin/analytics/users",
    file: "@/pages/dashboard/admin/analytics/users/index.vue",
    settings: { auth: true },
  },
  {
    name: "dashboard-user-account",
    newName: "dash-user-account",
    path: "/dashboard/user/account",
    file: "@/pages/dashboard/user/account/index.vue",
    settings: { auth: true, access: "guest" },
  },
  {
    name: "dashboard-user-profile",
    newName: "dash-user-profile",
    path: "/dashboard/user/profile",
    file: "@/pages/dashboard/user/profile/index.vue",
    settings: { auth: true, access: "guest" },
  },
];
