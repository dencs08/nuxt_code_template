export function useAuthentication() {
    const client = useSupabaseClient();

    async function signIn(email,password){
        const { error } = await client.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        });
        if (error) {
            throw error;
        }
    }

    async function signUp(email, password) {
        try {
            const { data, error } = await client.auth.signUp({
                email: email.value,
                password: password.value,
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

    return {
        signIn,
        signInWithOAuth,
        signUp,
        signOut
    };
}