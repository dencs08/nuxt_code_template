// config/auth.ts

export default {
    auth: {
        globalAppMiddleware: {
            isEnabled: false,
        },
        provider: {
            type: "local",
            pages: {
                login: "/login",
            },
            endpoints: {
                signIn: { path: "/login", method: "post" },
                signOut: { path: "/logout", method: "post" },
                signUp: { path: "/register", method: "post" },
                getSession: { path: "/user", method: "get" },
            },
            token: {
                maxAgeInSeconds: 86400,
            },
        },
        baseURL: process.env.BASE_API_URL,
    },
};