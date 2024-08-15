import { type SessionScope } from "../../types/common";
import type {
  GenericOAuthProvider,
  GenericOtpType,
} from "@/services/auth/AuthServiceInterface";
import { type UserAuthPublicSession } from "../../types/user";

export function useAuthentication() {
  const nuxtApp = useNuxtApp();
  const { $authProvider } = useNuxtApp();

  if (!$authProvider) {
    throw new Error("Auth provider not found");
  }

  const signIn = async ({
    email,
    password,
    options,
  }: {
    email: string;
    password: string;
    options: { captchaToken: string };
  }) => {
    const response = await $authProvider.signIn(email, password, options);
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
    const response = await $authProvider.signUp(email, password, options);
    handleRequestError(response);
  };

  const signInWithOAuth = async (provider: GenericOAuthProvider) => {
    const response = await $authProvider.signInWithOAuth(provider);
    handleRequestError(response);
  };

  const signInWithOAuthPopup = async (provider: GenericOAuthProvider) => {
    const response = await $authProvider.signInWithOAuthWithPopup(provider);
    handleRequestError(response);
    // redirectInPopup(response.data.url);
  };

  const signOut = async () => {
    const response = await $authProvider.signOut();
    handleRequestError(response);
  };

  const lostPassword = async ({ email }: { email: string }) => {
    const response = await $authProvider.resetPassword(email);
    handleRequestError(response);
  };

  const updateAuthProfile = async (attributes: any, options?: any) => {
    const response = await $authProvider.updateUser(attributes, options);
    handleRequestError(response);
  };

  const updatePassword = (password: string) => updateAuthProfile({ password });

  const updateEmail = (email: string, emailRedirectTo?: string) =>
    updateAuthProfile({ email }, { emailRedirectTo });

  const changeUserPassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    const response = await $authProvider.changePassword(
      currentPassword,
      newPassword
    );
    // console.log(response);

    handleRequestError(response);
    return response;
  };

  const terminateSession = async (scope: SessionScope) => {
    const response = await $authProvider.terminateSession(scope);
    handleRequestError(response);
  };

  const verifyPassword = async (password: string) => {
    const response = await $authProvider.verifyPassword(password);
    handleRequestError(response);
  };

  const getUser = async (): Promise<any | null> => {
    const nuxtApp = useNuxtApp();
    let user: any | null = null;
    await nuxtApp.runWithContext(async () => {
      user = await $authProvider.getUser();
    });
    return user;
  };

  const getSession = async () => {};

  const verifyOtp = async (tokenHash: string, type: GenericOtpType) => {
    const result = await $authProvider.verifyOtp(tokenHash, type);
    if (result) {
      const user = result.user;
      const session = result.session;
      return { user, session };
    } else {
      return { user: null, session: null };
    }
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
    verifyPassword,
    terminateSession,
    getUser,
    getSession,
    verifyOtp,
  };
}

const handleRequestError = (response: any): void => {
  if (!response) throw new CustomError("Response is null or undefined");
  if (response.error) throw new CustomError(response.error.message, response);
};
