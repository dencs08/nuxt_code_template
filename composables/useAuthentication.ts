import { supabaseAuthenticationService } from "@/services/authentication";
import type { IAuthenticationService as IAuthenticationService } from "@/services/authentication";
import type { Provider as OAuthProvider } from "@supabase/gotrue-js";
import { type SessionScope } from "../utils/types";

export function useAuthentication() {
    const authService: IAuthenticationService = supabaseAuthenticationService("supabase");

    async function signIn({ email, password }: { email: string; password: string }): Promise<void> {
        const response = await authService.signIn(email, password);
        handleRequestError(response);
    }

    async function signUp({ email, password }: { email: string; password: string }): Promise<void> {
        const response = await authService.signUp(email, password);
        handleRequestError(response);
    }

    const signInWithOAuth = async (provider: OAuthProvider): Promise<void> => {
        const response = await authService.signInWithOAuth(provider);
        handleRequestError(response);
    };

    const signInWithOAuthPopup = async (provider: OAuthProvider): Promise<void> => {
        const response = await authService.signInWithOAuthWithPopup(provider);
        handleRequestError(response);
        redirectInPopup(response.data.url);
    };

    const signOut = async (): Promise<void> => {
        const response = await authService.signOut();
        handleRequestError(response);
    };

    async function lostPassword({ email }: { email: string }): Promise<void> {
        const response = await authService.resetPassword(email);
        handleRequestError(response);
    }

    async function updateAuthProfile(attributes: any, options?: any): Promise<void> {
        const response = await authService.updateUser(attributes, options);
        // handleRequestError(response); // Uncomment if you need to handle errors here
    }

    const updatePassword = (password: string): Promise<void> => updateAuthProfile({ password });
    const updateEmail = (email: string, emailRedirectTo?: string): Promise<void> =>
        updateAuthProfile({ email }, { emailRedirectTo });

    // Used when wanting to change the password with the current password verification
    const changeUserPassword = async (
        currentPassword: string,
        newPassword: string
    ): Promise<any> => {
        return authService.changePassword(currentPassword, newPassword);
    };

    const terminateSession = async (scope: SessionScope): Promise<void> => {
        const response = await authService.terminateSession(scope);
        handleRequestError(response);
    };

    const verifyPassword = async (password: string): Promise<void> => {
        const response = await authService.verifyPassword(password);
        handleRequestError(response);
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
    };
}

const handleRequestError = (response: any): void => {
    if (response.error) throw new CustomError(response.error.message, response);
};

function redirectInPopup(url: string): void {
    // Define dimensions and positioning for the popup
    const width = 600;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const popup = window.open(
        url,
        "_blank",
        `width=${width},height=${height},left=${left},top=${top}`
    );
    if (!popup) return; // Check if popup was successfully opened

    // Adjusted to use the correct function name from useAuthListeners
    const { handleAuthListener } = useAuthListeners();

    const customFunction = (event: any, session: any) => {
        popup.close();
    };

    // Now correctly using the function name as provided by useAuthListeners
    handleAuthListener("SIGNED_IN", customFunction);
}
