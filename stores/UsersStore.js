export const useUsersStore = defineStore({
    id: 'usersStore',

    state: () => ({
        users: [],
        loading: false,
        userSession: null
    }),

    getters: {
        userEmails(state) {
            return state.users ? state.users.email : 'No email provided.';
        },
        totalCount(state) {
            return state.users.length;
        },
        getUserSession: (state) => {
            return state.userSession;
        }
    },

    actions: {
        fetchUsers: withErrorHandler(async function () {
            this.loading = true;
            const client = useSupabaseClient();

            try {
                let { data: userData, error: userError } = await client
                    .from('users')
                    .select(`
                        *,
                        user_roles!inner(
                            role
                        )
                    `);

                if (userError) {
                    throw userError;
                }

                this.users = userData.map(user => ({
                    ...user,
                    role: user.user_roles.role,
                    user_roles: undefined,
                }));

            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        }),
        addUser() {
        },
        deleteUser() {
        },
        async updateUser(data) {
            this.loading = true;
            const client = useSupabaseClient();
            const { data: sessionData, error: sessionError } = await client.auth.getSession();

            if (sessionError || !sessionData || !sessionData.session || !sessionData.session.access_token) {
                throw new Error(sessionError || 'Invalid session data');
            }

            const { data: updateData, pending, error: updateError, refresh } = useFetch('/api/update-user', {
                method: 'POST',
                body: {
                    "token": sessionData.session.access_token
                }
            });

            await pending.value;

            if (updateError.value) {
                throw new Error(updateError.value.message || 'Error updating user');
            }

            this.loading = false;
            // return updateData.value || 'User updated successfully';
        },
        async fetchUserSession() {
            this.loading = true;
            const { userSession } = useUser();
            try {
                const user = await userSession();
                this.userSession = user;
            } catch (error) {
                console.error('Error in fetchAuthenticatedUser:', error);
                this.userSession = null;
            } finally {
                this.loading = false;
            }
        }
    }
});
