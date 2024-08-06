import { SupabaseClient } from "@supabase/supabase-js";
import { type IAuthenticationService } from "../AuthServiceInterface.js";
import type { Provider as OAuthProvider } from "@supabase/supabase-js";
import type { EmailOtpType } from "@supabase/supabase-js";

export class SupabaseAuthService implements IAuthenticationService {
  private client: SupabaseClient;

  constructor() {
    // const nuxtApp = useNuxtApp();
    this.client = useSupabaseClient();
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
    return new Promise((resolve, reject) => {
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
    return new Promise((resolve, reject) => {
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

  async verifyOtp(
    tokenHash: string,
    type: EmailOtpType
  ): Promise<{ user: any; session: any } | { user: null; session: null }> {
    const { data, error } = await this.client.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  async getUser() {
    const userAuthSession = useSupabaseUser();

    if (!userAuthSession.value) {
      return null; // Return null if no user is logged in
    }

    const additionalFields = await this.getAdditionalUserFields(
      userAuthSession.value.id
    );

    const provider = userAuthSession.value.app_metadata.provider;

    return {
      ...userAuthSession.value,
      ...additionalFields,
      provider,
    };
  }

  private async getAdditionalUserFields(userId: string) {
    if (!userId) {
      return null;
    }

    try {
      const { data: user } = (await this.client
        .from("users")
        .select("*, user_roles!inner(role)")
        .eq("id", userId)
        .single()) as { data: UserAuthPublicSession | null };

      if (user) {
        user.role = user.user_roles.role;
        delete user.user_roles;
      }

      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new CustomError(error.message, error);
      } else {
        throw error;
      }
    }
  }
}
