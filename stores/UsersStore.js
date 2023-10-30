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
        fetchUsers: withErrorHandler(async function() {
            this.loading = true;
            const client = useSupabaseClient();
            const { data, error } = await client.from('users').select('*');

            if (error) {
                throw error;
            }

            this.users = data;
            this.loading = false;
        }),
        addUser() {
        },
        deleteUser() {
        },
        updateUser(){

        }
    }
});
