import { getAuthService } from "@/services/auth/AuthServiceInterface";
import type { IAuthenticationService } from "@/services/auth/AuthServiceInterface";
import { type SessionScope } from "../utils/types";
import type { Provider as OAuthProvider } from "@supabase/gotrue-js";
import { callWithNuxt } from "#app";

export function useAuthentication() {
  const runtimeConfig = useRuntimeConfig();

  let authService: IAuthenticationService | null = null;

  async function initializeAuthService() {
    const authProvider = runtimeConfig.public.authProvider as
      | "supabase"
      | "sidebase";
    authService = await getAuthService(authProvider);
  }

  const ensureAuthServiceInitialized = async () => {
    if (!authService) await initializeAuthService();
  };

  async function signIn({
    email,
    password,
    options,
  }: {
    email: string;
    password: string;
    options: { captchaToken: string };
  }): Promise<void> {
    await ensureAuthServiceInitialized();
    const response = await authService.signIn(email, password, options);
    handleRequestError(response);
  }

  async function signUp({
    email,
    password,
    options,
  }: {
    email: string;
    password: string;
    options: { captchaToken: string };
  }): Promise<void> {
    await ensureAuthServiceInitialized();
    const response = await authService.signUp(email, password, options);
    handleRequestError(response);
  }

  const signInWithOAuth = async (provider: OAuthProvider): Promise<void> => {
    await ensureAuthServiceInitialized();
    const response = await authService.signInWithOAuth(provider);
    handleRequestError(response);
  };

  const signInWithOAuthPopup = async (
    provider: OAuthProvider
  ): Promise<void> => {
    await ensureAuthServiceInitialized();
    const response = await authService.signInWithOAuthWithPopup(provider);
    handleRequestError(response);
    redirectInPopup(response.data.url);
  };

  const signOut = async (): Promise<void> => {
    await ensureAuthServiceInitialized();
    const response = await authService.signOut();
    handleRequestError(response);
  };

  async function lostPassword({ email }: { email: string }): Promise<void> {
    await ensureAuthServiceInitialized();
    const response = await authService.resetPassword(email);
    handleRequestError(response);
  }

  async function updateAuthProfile(
    attributes: any,
    options?: any
  ): Promise<void> {
    await ensureAuthServiceInitialized();
    const response = await authService.updateUser(attributes, options);
    // handleRequestError(response); // Uncomment if you need to handle errors here
  }

  const updatePassword = (password: string): Promise<void> =>
    updateAuthProfile({ password });

  const updateEmail = (
    email: string,
    emailRedirectTo?: string
  ): Promise<void> => updateAuthProfile({ email }, { emailRedirectTo });

  const changeUserPassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<any> => {
    await ensureAuthServiceInitialized();
    return authService.changePassword(currentPassword, newPassword);
  };

  const terminateSession = async (scope: SessionScope): Promise<void> => {
    await ensureAuthServiceInitialized();
    const response = await authService.terminateSession(scope);
    handleRequestError(response);
  };

  const verifyPassword = async (password: string): Promise<void> => {
    await ensureAuthServiceInitialized();
    const response = await authService.verifyPassword(password);
    handleRequestError(response);
  };

  const getUserSession = async (): Promise<void> => {
    await ensureAuthServiceInitialized();
    const response = await authService.getUserSession();
    handleRequestError(response);
  };

  const getPublicUserSession = async (): Promise<any> => {
    await ensureAuthServiceInitialized();
    const { data } = await useAsyncData<any>(
      () =>
        new Promise((resolve) => resolve(authService.getPublicUserSession()))
    );
    return data;
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
