export type AuthProvider = "supabase" | "firebase" | "kindle" | "laravel";
import type { Provider as OAuthProvider } from "@supabase/gotrue-js";
import { type SessionScope } from "../utils/types";

export interface IAuthenticationService {
    signIn: (email: string, password: string) => Promise<any>;
    signUp: (email: string, password: string) => Promise<any>;
    signInWithOAuth: (provider: OAuthProvider) => Promise<any>;
    signInWithOAuthWithPopup: (provider: OAuthProvider) => Promise<any>;
    signOut: () => Promise<any>;
    resetPassword: (email: string) => Promise<any>;
    updateUser: (attributes: any, options?: any) => Promise<any>;
    changePassword: (oldPassword: string, newPassword: string) => Promise<any>;
    terminateSession: (scope: SessionScope) => Promise<any>;
    verifyPassword: (password: string) => Promise<any>;
}

type SupabaseClientType = ReturnType<typeof useSupabaseClient>;

//if firebase or any other provider put them here
// type FirebaseClientType = ReturnType<typeof useFirebaseClient>;
// type ClientType = SupabaseClientType | FirebaseClientType;

type ClientType = SupabaseClientType;

export function authenticationService(provider: AuthProvider): IAuthenticationService {
    let client: ClientType;

    switch (provider) {
        case "supabase":
            client = useSupabaseClient();
            break;
        // case 'firebase':
        //     client = useFirebaseClient();
        //     break;
        default:
            throw new Error(`Unsupported auth provider: ${provider}`);
    }

    return {
        signIn: (email, password) => client.auth.signInWithPassword({ email, password }),
        signUp: (email, password) => client.auth.signUp({ email, password }),
        signInWithOAuth: (oauthProvider: OAuthProvider) =>
            client.auth.signInWithOAuth({ provider: oauthProvider }),
        signInWithOAuthWithPopup: (oauthProvider: OAuthProvider) =>
            client.auth.signInWithOAuth({
                provider: oauthProvider,
                options: { skipBrowserRedirect: true },
            }),
        signOut: () => client.auth.signOut(),
        updateUser: (attributes, options?) => client.auth.updateUser(attributes, options),
        resetPassword: (email) => client.auth.resetPasswordForEmail(email),
        changePassword: (oldPassword: string, newPassword: string) =>
            new Promise((resolve, reject) => {
                client
                    //@ts-ignore
                    .rpc<any, { current_plain_password: string; new_plain_password: string }>(
                        "change_user_password",
                        {
                            current_plain_password: oldPassword,
                            new_plain_password: newPassword,
                        }
                    )
                    .then(
                        (response) => {
                            if (response.error) {
                                reject(response.error);
                            } else {
                                resolve(response);
                            }
                        },
                        (error) => reject(error)
                    );
            }),
        verifyPassword: (password: string) =>
            new Promise((resolve, reject) => {
                client
                    //@ts-ignore
                    .rpc<any, { current_plain_password: string }>("verify_user_password", {
                        current_plain_password: password,
                    })
                    .then((response) => {
                        if (response.error) {
                            reject(response.error);
                        } else {
                            resolve(response);
                        }
                    });
            }),
        terminateSession: (scope: SessionScope = "others") => {
            return client.auth.signOut({ scope: scope });
        },
    };
}
