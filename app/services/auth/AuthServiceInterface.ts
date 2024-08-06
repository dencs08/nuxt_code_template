import { type SessionScope } from "@/utils/types";

export type GenericOAuthProvider = any;
export type GenericOtpType = any;

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
  signInWithOAuth: (provider: GenericOAuthProvider) => Promise<any>;
  signInWithOAuthWithPopup: (provider: GenericOAuthProvider) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updateUser: (attributes: any, options?: any) => Promise<any>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<any>;
  terminateSession: (scope: SessionScope) => Promise<any>;
  verifyPassword: (password: string) => Promise<any>;
  getUser: () => Promise<any>;
  verifyOtp: (
    tokenHash: string,
    type: GenericOtpType
  ) => Promise<{ user: any; session: any } | { user: null; session: null }>;
}
