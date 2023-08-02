// This Nuxt middleware function checks the user's authentication state and performs redirects based on route metadata.
export default defineNuxtRouteMiddleware(async (to, from) => {
    const localePath = useLocalePath();
    const LOGIN_PATH = '/login';

    const user = useSupabaseUser();
    const auth = to.meta.auth;

    // If `auth` is set to `false`, allow all users regardless of authentication state.
    if (auth === false) return;

    try {
        // Handle routes that should only be accessed by unauthenticated users.
        if (auth && auth.unauthenticatedOnly) {
            // If the user is authenticated, redirect them to a different route.
            if (user.value !== null) {
                return navigateTo(localePath(auth.navigateAuthenticatedTo));
            }
            // If the user is not authenticated, allow them to access the route.
            else {
                return;
            }
        }

        // If `auth` is undefined, assume the route requires authentication, so if the user is authenticated they can access the route.
        if (auth === undefined && user.value !== null) return;

        // If the user is not authenticated and the route requires authentication, redirect to the login page.
        if (user.value === null && auth !== false && to.path !== localePath(LOGIN_PATH)) {
            return navigateTo(localePath(LOGIN_PATH));
        }
    } catch (error) {
        // Log the error and consider redirecting the user to an error page.
        console.error(error);
        // navigateTo('/error');
    }
});
