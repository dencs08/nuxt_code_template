export function useAuthListeners() {
    const client = useSupabaseClient();

    const handleAuthStateChange = (
        authEvent: string,
        callback: (event: string, session: any) => void
    ) => {
        const authSubscription = client.auth.onAuthStateChange((event, session) => {
            if (event === authEvent) callback(event, session);
        }) as unknown as { cancel: () => void };

        // Return a function to cancel the subscription
        return () => {
            if (authSubscription) {
                // authSubscription.cancel(); // no way ATM to cancel in JS
            }
        };
    };

    return {
        handleAuthListener: handleAuthStateChange,
    };
}
