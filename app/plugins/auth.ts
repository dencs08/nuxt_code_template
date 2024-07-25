import { SupabaseAuthService } from "../services/auth/supabase/SupabaseAuthService";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  let authProvider;

  if (config.public.authProvider === "supabase") {
    authProvider = new SupabaseAuthService();
  } else if (config.public.authProvider === "sidebase") {
    authProvider = new SupabaseAuthService();
  } else {
    throw new Error("Invalid auth provider specified in config");
  }

  return {
    provide: {
      authProvider,
    },
  };
});
