import type { EmailOtpType } from "@supabase/supabase-js";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxt = useNuxtApp();
  const client = useSupabaseClient();

  const tokenHash = to.query.token_hash as string;
  const type = to.query.type as EmailOtpType;
  const verifiedToken = useCookie("verified_token");
  // const redirectTo = (to.query.redirect_to as string) || '/dashboard/user/account/update-password';
  // console.log('SSR:', import.meta.server);
  // console.log('Token Hash:', tokenHash);
  // console.log('Type:', type);
  // console.log('Redirect To:', redirectTo);

  if (tokenHash && type) {
    try {
      const { data, error } = await client.auth.verifyOtp({
        token_hash: tokenHash,
        type,
      });

      if (error) {
        return navigateTo(nuxt.$localePath({ name: "index" }));
      }

      if (data && data.user) {
        // const usersStore = useUsersStore();
        // usersStore.setUser(data.user);
        verifiedToken.value = tokenHash;

        // console.log('User authenticated:', data.user);
        // return navigateTo(nuxt.$localePath(redirectTo), { replace: true, external: true}); //right now the verify page redirects the user.
      } else {
        return navigateTo(nuxt.$localePath({ name: "index" })); //home or error page
      }
    } catch (error) {
      return navigateTo(nuxt.$localePath({ name: "index" })); //home or error page
    }
  } else {
    return navigateTo(nuxt.$localePath({ name: "index" })); //home or error page
  }
});
