//@ts-ignore
import type { Provider as OAuthProvider } from "@supabase/gotrue-js";
import { type SessionScope } from "@/utils/types";
import { SupabaseAuthService } from "./SupabaseAuthService";

export interface IAuthenticationService {
  signIn: (
    email: string,
    password: string,
    options?: { captchaToken?: string }
  ) => Promise<any>;
  signUp: (
    email: string,
    password: string,
    options?: { captchaToken?: string }
  ) => Promise<any>;
  signInWithOAuth: (provider: OAuthProvider) => Promise<any>;
  signInWithOAuthWithPopup: (provider: OAuthProvider) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updateUser: (attributes: any, options?: any) => Promise<any>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<any>;
  terminateSession: (scope: SessionScope) => Promise<any>;
  verifyPassword: (password: string) => Promise<any>;
  getUserSession: () => Promise<any>;
  getPublicUserSession: () => Promise<any>;
}

export async function getAuthService(
  serviceName: "supabase" | "sidebase"
): Promise<IAuthenticationService> {
  if (serviceName === "supabase") {
    const authService = new SupabaseAuthService();
    return authService;
  } else if (serviceName === "sidebase") {
    // const authService = new SidebaseAuthService();
    // return authService;
  }
}
