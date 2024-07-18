import { getAuthService } from "@/services/auth/AuthServiceInterface";
import type { IAuthenticationService } from "@/services/auth/AuthServiceInterface";
import { type SessionScope } from "../utils/types";
import type { Provider as OAuthProvider } from "@supabase/gotrue-js";
import { type UserAuthPublicSession } from "../utils/types";

export function useAuthentication() {
  let authService: IAuthenticationService | null = null;
  const runtimeConfig = useRuntimeConfig();

  const initializeAuthService = async () => {
    if (!authService) {
      const authProvider = runtimeConfig.public.authProvider as
        | "supabase"
        | "sidebase";
      authService = await getAuthService(authProvider);
    }
  };

  const signIn = async ({
    email,
    password,
    options,
  }: {
    email: string;
    password: string;
    options: { captchaToken: string };
  }) => {
    await initializeAuthService();
    const response = await authService.signIn(email, password, options);
    handleRequestError(response);
  };

  const signUp = async ({
    email,
    password,
    options,
  }: {
    email: string;
    password: string;
    options: { captchaToken: string };
  }) => {
    await initializeAuthService();
    const response = await authService.signUp(email, password, options);
    handleRequestError(response);
  };

  const signInWithOAuth = async (provider: OAuthProvider) => {
    await initializeAuthService();
    const response = await authService.signInWithOAuth(provider);
    handleRequestError(response);
  };

  const signInWithOAuthPopup = async (provider: OAuthProvider) => {
    await initializeAuthService();
    const response = await authService.signInWithOAuthWithPopup(provider);
    handleRequestError(response);
    redirectInPopup(response.data.url);
  };

  const signOut = async () => {
    await initializeAuthService();
    const response = await authService.signOut();
    handleRequestError(response);
  };

  const lostPassword = async ({ email }: { email: string }) => {
    await initializeAuthService();
    const response = await authService.resetPassword(email);
    handleRequestError(response);
  };

  const updateAuthProfile = async (attributes: any, options?: any) => {
    await initializeAuthService();
    const response = await authService.updateUser(attributes, options);
  };

  const updatePassword = (password: string) => updateAuthProfile({ password });

  const updateEmail = (email: string, emailRedirectTo?: string) =>
    updateAuthProfile({ email }, { emailRedirectTo });

  const changeUserPassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    await initializeAuthService();
    return authService.changePassword(currentPassword, newPassword);
  };

  const terminateSession = async (scope: SessionScope) => {
    await initializeAuthService();
    const response = await authService.terminateSession(scope);
    handleRequestError(response);
  };

  const verifyPassword = async (password: string) => {
    await initializeAuthService();
    const response = await authService.verifyPassword(password);
    handleRequestError(response);
  };

  const getUserSession = async () => {
    await initializeAuthService();
    const response = await authService.getUserSession();
    handleRequestError(response);
  };

  const getPublicUserSession =
    async (): Promise<UserAuthPublicSession | null> => {
      const nuxtApp = useNuxtApp();
      await initializeAuthService();
      let user: UserAuthPublicSession | null = null;
      await nuxtApp.runWithContext(async () => {
        user = await authService.getPublicUserSession();
      });
      return user;
    };

  return {
    signIn,
    signInWithOAuth,
    signInWithOAuthPopup,
    signUp,
    signOut,
    lostPassword,
    updatePassword,
    updateEmail,
    updateAuthProfile,
    changeUserPassword,
    terminateSession,
    verifyPassword,
    getUserSession,
    getPublicUserSession,
  };
}

const handleRequestError = (response: any): void => {
  if (!response) throw new CustomError("Response is null or undefined");
  if (response.error) throw new CustomError(response.error.message, response);
};

function redirectInPopup(url: string): void {
  const width = 600;
  const height = 600;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  const popup = window.open(
    url,
    "_blank",
    `width=${width},height=${height},left=${left},top=${top}`
  );
  if (!popup) return;

  const { handleAuthListener } = useAuthListeners();
  const customFunction = (event: any, session: any) => {
    popup.close();
  };

  handleAuthListener("SIGNED_IN", customFunction);
}
