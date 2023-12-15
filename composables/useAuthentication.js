import { authenticationService } from '@/services/authentication';
import {userService} from '@/services/insertUserMeta'
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

    async function lostPassword({email}) {
        const response = await authService.resetPassword(email);
        handleRequestError(response);
    }

    async function updateProfile(payload) {
        const response = await authService.updateUser(payload);
        handleRequestError(response);
        if (payload.password) return "Password has been updated.";
        if (payload.email) return "Email has been updated.";
    }

    const updatePassword = password => updateProfile(password);
    const updateEmail = email => updateProfile(email);

    return {
        signIn,
        signInWithOAuth,
        signInWithOAuthPopup,
        signUp,
        signOut,
        lostPassword,
        updatePassword,
        updateEmail
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
    const {handleAuthStateChange} = useAuthListeners();
    handleAuthStateChange('SIGNED_IN', customFunction)
}