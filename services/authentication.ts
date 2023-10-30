type AuthProvider = 'supabase' | 'firebase';
import { Provider as OAuthProvider } from "@supabase/gotrue-js";

interface IAuthenticationService {
    signIn: (email: string, password: string) => Promise<any>;
    signUp: (email: string, password: string) => Promise<any>;
    signInWithOAuth: (provider: OAuthProvider) => Promise<any>;
    signInWithOAuthWithPopup: (provider: OAuthProvider) => Promise<any>;
    signOut: () => Promise<any>;
    resetPassword: (email: string) => Promise<any>;
    updateUser: (payload: any) => Promise<any>;
}

type SupabaseClientType = ReturnType<typeof useSupabaseClient>;

//if firebase or any other provider put them here
// type FirebaseClientType = ReturnType<typeof useFirebaseClient>;
// type ClientType = SupabaseClientType | FirebaseClientType;

type ClientType = SupabaseClientType

export function authenticationService(provider: AuthProvider): IAuthenticationService {
    let client: ClientType;

    switch (provider) {
        case 'supabase':
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
        signInWithOAuth: (oauthProvider: OAuthProvider) => client.auth.signInWithOAuth({ provider: oauthProvider }),
        signInWithOAuthWithPopup: (oauthProvider: OAuthProvider) => client.auth.signInWithOAuth({ provider: oauthProvider, options: {skipBrowserRedirect: true}}),
        signOut: () => client.auth.signOut(),
        resetPassword: (email) => client.auth.resetPasswordForEmail(email),
        updateUser: (payload) => client.auth.updateUser(payload),
    };
}