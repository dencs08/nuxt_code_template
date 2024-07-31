// This Nuxt middleware function checks the user's authentication state and performs redirects based on route metadata.
export default defineNuxtRouteMiddleware(async (to, from) => {
  const authRequired = to.meta.auth;

  // If `auth` on a route is set to `false`, allow all users regardless of authentication state.
  if (authRequired === false) return;

  const nuxt = useNuxtApp();
  const userStore = useUserStore();
  await userStore.fetchUser();
  const user = userStore.getUser;
  console.log("User", user);

  try {
    // Handle routes that should only be accessed by unauthenticated users. (i.e. login page)
    if (authRequired && authRequired.unauthenticatedOnly) {
      // If the user is authenticated, redirect them to a different route.
      if (user) {
        return navigateTo(
          nuxt.$localePath({
            name: authRequired.navigateAuthenticatedTo || "index",
          })
        );
      }
      // If the user is not authenticated, allow them to access the route.
      return;
    }

    // If `auth` is undefined or requires authentication, check the user's state
    if (authRequired === undefined || authRequired === true) {
      // If the user is not authenticated and the route requires authentication, redirect to the login page.
      if (!user) {
        return navigateTo(nuxt.$localePath({ name: "login" }));
      }
      // If the user is authenticated, allow them to access the route.
      return;
    }
  } catch (error) {
    // Log the error and consider redirecting the user to an error page.
    console.error(error);
    // navigateTo('/error');
  }
});
