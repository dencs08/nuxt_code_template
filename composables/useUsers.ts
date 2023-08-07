export function useUsers() {
    const client = useSupabaseClient();

    const users = ref([]);
    const user = ref(null);
    const error = ref(null);
    const loading = ref(true);

    const fetchUsers = async () => {
        try {
            const { data, error } = await client.auth.admin.listUsers();
            if (error) throw error;
            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw error;
            }
        }
    };

    const fetchUser = async (id: number) => {

    };

    const createUser = async (userData: any) => {

    };

    return { users, user, fetchUsers, fetchUser, createUser, error, loading };
}
