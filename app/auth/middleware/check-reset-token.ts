import type { GenericOtpType } from "@/auth/services/auth/AuthServiceInterface";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxt = useNuxtApp();
  const { generalPage } = useRedirections();

  const tokenHash = to.query.token_hash as string;
  const type = to.query.type as GenericOtpType;
  const verifiedToken = useCookie("verified_token");
  // const redirectTo = (to.query.redirect_to as string) || '/dashboard/user/account/update-password';
  // console.log('SSR:', import.meta.server);
  // console.log('Token Hash:', tokenHash);
  // console.log('Type:', type);
  // console.log('Redirect To:', redirectTo);

  if (tokenHash && type) {
    try {
      const data = await useAuthentication().verifyOtp(tokenHash, type);

      if (!data || !data.user) {
        return navigateTo(nuxt.$localePath({ name: generalPage() }));
      }

      if (data && data.user) {
        const userStore = useUserStore();
        //TODO check if it redirect the user (it happens on the verify page by watching)
        // userStore.setUser(data.user);
        verifiedToken.value = tokenHash;

        // console.log('User authenticated:', data.user);
        // return navigateTo(nuxt.$localePath(redirectTo), { replace: true, external: true}); //right now the verify page redirects the user.
      } else {
        return navigateTo(nuxt.$localePath({ name: generalPage() })); //home or error page
      }
    } catch (error) {
      return navigateTo(nuxt.$localePath({ name: generalPage() })); //home or error page
    }
  } else {
    return navigateTo(nuxt.$localePath({ name: generalPage() })); //home or error page
  }
});
