import { SupabaseAuthService } from "../services/auth/supabase/SupabaseAuthService";
import { SidebaseAuthService } from "../services/auth/sidebase/SidebaseAuthService";
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  let authProvider;

  if (config.public.authProvider === "supabase") {
    authProvider = new SupabaseAuthService();
  } else if (config.public.authProvider === "sidebase") {
    authProvider = new SidebaseAuthService();
  } else {
    throw new Error("Invalid auth provider specified in config");
  }

  return {
    provide: {
      authProvider,
    },
  };
});
