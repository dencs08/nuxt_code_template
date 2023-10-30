export function useUser() {
    const client = useSupabaseClient();

    const fetchUser = async () => {
        interface User {
            role?: string; // add more fields based on your user structure
        }

        try {
            const {data: user} = await client.from("users").select("*").single() as {data: User | null};
            return user;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw error;
            }
        }
    };

    return { fetchUser };
}
