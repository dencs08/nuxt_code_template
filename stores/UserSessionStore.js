export const userSessionStore = defineStore({
    id: 'userSessionStore',

    state: () => ({
        user: [],
        loading: false
    }),

    getters: {
        userEmail(state) {
            return state.user ? state.user.email : 'No email provided.';
        },
    },

    actions: {
        async fetchUser() {
            this.loading = true

            const client = useSupabaseClient();
            const { data, error } = await client.from("users").select("*")

            const { addToast } = useToastService();
            if (error) {
                addToast('error', 'error', error.message)
            }

            this.user = data
            this.loading = false
        },
    }
});
