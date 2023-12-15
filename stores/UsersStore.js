export const useUsersStore = defineStore({
    id: 'usersStore',

    state: () => ({
        users: [],
        loading: false
    }),

    getters: {
        userEmails(state) {
            return state.users ? state.users.email : 'No email provided.';
        },
        totalCount(state) {
            return state.users.length;
        }
    },

    actions: {
        fetchUsers: withErrorHandler(async function () {
            this.loading = true;
            const client = useSupabaseClient();

            // Fetch user records from own 'users' table.
            let { data: userData, error: userError } = await client.from('users').select('*');
            if (userError) {
                throw userError;
            }

            this.users = userData;
            this.loading = false;
        }),
        addUser() {
        },
        deleteUser() {
        },
        updateUser() {

        }
    }
});
