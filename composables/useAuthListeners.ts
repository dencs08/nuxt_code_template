export function useAuthListeners() {
    const client = useSupabaseClient();

    const handleAuthStateChange = (authEvent, callback = () => {}) => {
        client.auth.onAuthStateChange((event, session) => {
            if (event == authEvent) callback(event, session);
        })
    }

    return {
        handleAuthStateChange
    };
}
