import type { GenericOtpType } from "@/auth/services/auth/AuthServiceInterface";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxt = useNuxtApp();
  const { generalPage } = useRedirections();

  const tokenHash = to.query.token_hash as string;
  const type = to.query.type as GenericOtpType;
  // console.log('SSR:', import.meta.server);
  // console.log('Token Hash:', tokenHash);
  // console.log('Type:', type);
  // console.log('Redirect To:', redirectTo);

  if (!tokenHash || !type)
    return navigateTo(nuxt.$localePath({ name: generalPage() })); //home or error page

  try {
    console.log("Verifying token...");
    const data = await useAuthentication().verifyOtp(tokenHash, type);

    if (!data || !data.user) {
      return navigateTo(nuxt.$localePath({ name: generalPage() }));
    }

    if (data && data.user) {
      const userStore = useUserStore();
      await userStore.setUser(data.user);
      console.log("User authenticated:", data.user);

      // console.log('User authenticated:', data.user);
      // return navigateTo(nuxt.$localePath(redirectTo), { replace: true, external: true}); //right now the verify page redirects the user.
    } else {
      console.log("No user data found");
      return navigateTo(nuxt.$localePath({ name: generalPage() })); //home or error page
    }
  } catch (error) {
    console.log("Error verifying token:", error);
    return navigateTo(nuxt.$localePath({ name: generalPage() })); //home or error page
  }
});
