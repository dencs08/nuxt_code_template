//@ts-ignore
import { SupabaseClient } from "@supabase/supabase-js";
import { type IAuthenticationService } from "./AuthServiceInterface";
import { SupabaseUserSession } from "./SupabaseUserSession";
import type { Provider as OAuthProvider } from "@supabase/gotrue-js";

export class SupabaseAuthService implements IAuthenticationService {
  private client: SupabaseClient;
  private userSessionService: SupabaseUserSession;

  constructor() {
    const nuxtApp = useNuxtApp();
    this.client = nuxtApp.$supabaseClient as unknown as SupabaseClient;
    this.userSessionService = new SupabaseUserSession();
  }

  async signIn(
    email: string,
    password: string,
    options?: { captchaToken?: string }
  ) {
    return this.client.auth.signInWithPassword({ email, password, options });
  }

  async signUp(
    email: string,
    password: string,
    options?: { captchaToken?: string }
  ) {
    return this.client.auth.signUp({ email, password, options });
  }

  async signInWithOAuth(provider: OAuthProvider) {
    return this.client.auth.signInWithOAuth({ provider });
  }

  async signInWithOAuthWithPopup(provider: OAuthProvider) {
    return this.client.auth.signInWithOAuth({
      provider,
      options: { skipBrowserRedirect: true },
    });
  }

  async signOut() {
    return this.client.auth.signOut();
  }

  async updateUser(attributes: any, options?: any) {
    return this.client.auth.updateUser(attributes, options);
  }

  async resetPassword(email: string) {
    return this.client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dashboard/user/account/update-password`,
    });
  }

  async changePassword(oldPassword: string, newPassword: string) {
    new Promise((resolve, reject) => {
      this.client
        //@ts-ignore
        .rpc<
          any,
          //@ts-ignore
          { current_plain_password: string; new_plain_password: string }
        >("change_user_password", {
          current_plain_password: oldPassword,
          new_plain_password: newPassword,
        })
        .then(
          (response: any) => {
            if (response.error) {
              reject(response.error);
            } else {
              resolve(response);
            }
          },
          (error: any) => reject(error)
        );
    });
  }

  async verifyPassword(password: string) {
    new Promise((resolve, reject) => {
      this.client
        //@ts-ignore
        .rpc<any, { current_plain_password: string }>("verify_user_password", {
          current_plain_password: password,
        })
        .then((response: any) => {
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response);
          }
        });
    });
  }

  async terminateSession(scope: SessionScope = "others") {
    return this.client.auth.signOut({ scope });
  }

  async getUserSession() {
    const userAuthSession = useSupabaseUser();
    return userAuthSession.value;
  }

  async getPublicUserSession() {
    return await this.userSessionService.fetchPublicUserSession();
  }
}
