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
        async fetchUsers() {
            this.loading = true;
            const client = useSupabaseClient();

            try {
                let { data: userData, error: userError } = await client
                    .from('users')
                    .select(`
                        *,
                        user_roles (
                            role
                        )
                    `);

                if (userError) {
                    throw userError;
                }

                this.users = userData.map(user => ({
                    ...user,
                    role: user.user_roles ? user.user_roles.role : 'No role assigned',
                }));

            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
        async addUser(data) {
            this.loading = true;
            const client = useSupabaseClient();

            try {
                const { data: user, error: userError } = await client.auth.signUp({
                    email: data.email,
                    password: data.password,
                    email_confirm: false,
                    options: {
                        data: {
                            full_name: data.name,
                            avatar_url: data.photo
                        }
                    }
                })

                if (userError) {
                    throw userError;
                }

                this.users.push(user.user);

                const { error: roleError } = await client
                    .from('user_roles')
                    .update({ role: data.role })
                    .eq('user_id', user.user.id)

                if (roleError) {
                    throw roleError;
                }

            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async deleteUser(userId) {
            this.loading = true;
            try {
                const client = useSupabaseClient();
                // const { data: deleteResult, error: error } = await client.from('users').delete().eq('id', userId);



                if (error) {
                    console.error(error);
                    throw error;
                }

                this.users = this.users.filter(user => user.id !== userId);

                return { status: 'success' };
            } catch (error) {
                return { status: 'error', error };
            } finally {
                this.loading = false;
            }
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
