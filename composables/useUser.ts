export function useUser() {
    const client = useSupabaseClient();

    const userSession = async () => {
        interface User {
            id: string;
            name: string;
            email: string;
            phone: string;
            role?: string;
            user_roles?: { role: string };
        }

        try {
            const { data: user } = (await client
                .from("users")
                .select(`*, user_roles!inner(role)`)
                .single()) as {
                data: User | null;
            };

            if (user) {
                user.role = user.user_roles.role;
                delete user.user_roles;
            }

            return user;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw error;
            }
        }
    };

    const fetchUser = async () => {
        interface User {
            role?: string; // add more fields based on your user structure
        }

        try {
            const { data: user } = (await client.from("users").select("*").single()) as {
                data: User | null;
            };
            return user;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw error;
            }
        }
    };

    return { fetchUser, userSession };
}
