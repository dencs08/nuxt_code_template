// services/auth/AuthServiceInterface.ts
import { SupabaseUserSession } from "./SupabaseUserSession";
import { SidebaseUserSession } from "./SidebaseUserSession";
import { type UserAuthPublicSession } from "@/utils/types";

export interface IUserSessionService {
  fetchPublicUserSession(): Promise<UserAuthPublicSession>;
}

export function createUserSessionService() {
  const runtimeConfig = useRuntimeConfig();
  console.log("runtimeConfig", runtimeConfig.public.authProvider);

  let UserSessionService;

  console.log(
    "runtimeConfig.public.authProvider",
    runtimeConfig.public.authProvider
  );

  switch (runtimeConfig.public.authProvider) {
    case "supabase":
      UserSessionService = new SupabaseUserSession(); // return an instance
      break;
    case "sidebase":
      UserSessionService = new SidebaseUserSession(); // return an instance
      break;
    // Add more cases as needed for additional services
    default:
      throw new Error(
        `Unsupported auth provider: ${runtimeConfig.public.authProvider}`
      );
  }

  return UserSessionService;
}
