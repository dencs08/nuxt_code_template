import { authenticationService } from '@/services/authentication';
export function useAuthentication() {
    const authService = authenticationService('supabase');
    const { handleRequestError } = useRequests();

    async function signIn({ email, password }) {
        const response = await authService.signIn(email, password);
        handleRequestError(response);
    }

    async function signUp({ email, password }) {
        const response = await authService.signUp(email, password);
        handleRequestError(response);
    }

    const signInWithOAuth = async provider => {
        const response = await authService.signInWithOAuth(provider);
        handleRequestError(response);
    }

    const signInWithOAuthPopup = async (provider) => {
        const response = await authService.signInWithOAuthWithPopup(provider);
        handleRequestError(response);
        redirectInPopup(response.data.url);
    }

    const signOut = async () => {
        const response = await authService.signOut();
        handleRequestError(response);
    }

    async function lostPassword({ email }) {
        const response = await authService.resetPassword(email);
        handleRequestError(response);
    }

    async function updateAuthProfile(attributes, options) {
        const response = await authService.updateUser(attributes, options);
        // handleRequestError(response);
    }

    const updatePassword = password => updateAuthProfile({ password: password });
    const updateEmail = (email, emailRedirectTo) => updateAuthProfile({ email: email }, { emailRedirectTo: emailRedirectTo });

    //used when want to change the password with the current password verification
    const changeUserPassword = async (currentPassword, newPassword) => {
        return authService.changePassword(currentPassword, newPassword);
    }

    const terminateSession = async (scope) => {
        const response = await authService.terminateSession(scope);
        handleRequestError(response);
    }

    const verifyPassword = async (password) => {
        const response = await authService.verifyPassword(password);
        handleRequestError(response);
    }

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
        verifyPassword
    };
}

function redirectInPopup(url) {
    // Define dimensions and positioning for the popup
    const width = 600;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const popup = window.open(url, '_blank', `width=${width},height=${height},left=${left},top=${top}`);

    const customFunction = (event, session) => {
        popup.close()
    };
    const { handleAuthStateChange } = useAuthListeners();
    handleAuthStateChange('SIGNED_IN', customFunction)
}