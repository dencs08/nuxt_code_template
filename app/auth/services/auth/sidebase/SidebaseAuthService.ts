import { type IAuthenticationService } from "../AuthServiceInterface.js";

export class SidebaseAuthService implements IAuthenticationService {
  private client: any; // make sidebase client here

  constructor() {
    // const nuxtApp = useNuxtApp();
    this.client = null;
  }

  async signIn(
    email: string,
    password: string,
    options?: { captchaToken?: string }
  ) {}

  async signUp(
    email: string,
    password: string,
    options?: { captchaToken?: string }
  ) {}

  async signInWithOAuth(provider: any) {}

  async signInWithOAuthWithPopup(provider: any) {}

  async signOut() {}

  async updateUser(attributes: any, options?: any) {}

  async resetPassword(email: string) {}

  async changePassword(oldPassword: string, newPassword: string) {}

  async verifyPassword(password: string) {}

  async terminateSession(scope: SessionScope = "others") {}

  async getUser() {}

  async verifyOtp(tokenHash: string, type: string) {}

  private async getAdditionalUserFields(userId: string) {}
}
