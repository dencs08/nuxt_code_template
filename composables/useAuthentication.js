export function useAuthentication() {
    const client = useSupabaseClient();

    async function signIn(email,password){
        const { error } = await client.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) {
            throw error;
        }
    }

    async function signUp(email, password) {
        try {
            const { data, error } = await client.auth.signUp({
                email: email,
                password: password,
            });
            if (error) throw new Error(error.message);
            return "Check your email to confirm your account.";
        } catch (error) {
            throw new Error(error.message);
        }
    }

    const signInWithOAuth = (provider) => {
        client.auth.signInWithOAuth({ provider })
    }

    const signOut = async () => {
        const {error} = await client.auth.signOut();
    }

    const lostPassword = async (email) => {
        try {
            const { data, error } = await client.auth.resetPasswordForEmail(email);
            if (error) throw new Error(error.message);
            return "Reset password instructions has been sent to your email.";
        } catch (error) {
            throw new Error(error.message);
        }
    }

    const updatePassword = async (password) => {
        try {
            const { data, error } = await client.auth.updateUser({
                password: password,
            })
            if (error) throw new Error(error.message);
            return "Password has been updated.";
        } catch (error) {
            throw new Error(error.message);
        }
    }

    const updateEmail = async (email) => {
        try {
            const { data, error } = await client.auth.updateUser({
                email: email,
                data: { route: 'world' }
            })
            if (error) throw new Error(error.message);
            return "Email has been updated.";
        } catch (error) {
            throw new Error(error.message);
        }
    }

    return {
        signIn,
        signInWithOAuth,
        signUp,
        signOut,
        lostPassword,
        updatePassword,
        updateEmail
    };
}