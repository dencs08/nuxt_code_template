import type { GenericOtpType } from "@/auth/services/auth/AuthServiceInterface";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return; //skip for SSR.
  const nuxt = useNuxtApp();
  const { generalPage } = useRedirections();

  const token = to.query.token as string;
  const type = to.query.type as GenericOtpType;
  if (!token || !type) {
    console.log("No token or type found. Redirecting to home page.");
    return navigateTo(nuxt.$localePath({ name: generalPage() })); //home or error page
  }

  try {
    console.log("Verifying token...");
    const data = await useAuthentication().verifyOtp(token, type);

    if (!data || !data.user) {
      console.log("No user data found");
      return navigateTo(nuxt.$localePath({ name: generalPage() }));
    }

    if (data && data.user) {
      const userStore = useUserStore();
      await userStore.setUser(data.user);
      console.log("User authenticated:", data.user);
      //verify-access-token PAGE redirects the user if user found.
    } else {
      console.log("No user data found");
      return navigateTo(nuxt.$localePath({ name: generalPage() })); //home or error page
    }
  } catch (error) {
    console.log("Error verifying token:", error);
    return navigateTo(nuxt.$localePath({ name: generalPage() })); //home or error page
  }
});
