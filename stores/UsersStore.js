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
        async fetchUsers() {
            this.loading = true

            const client = useSupabaseClient();
            const { data, error } = await client.from("user").select("*")

            if (error) {
                console.error('Error fetching users', error)
                return
            }

            this.users = data
            this.loading = false
        },
        addUser() {
        },
        deleteUser() {
        },
    }
});
