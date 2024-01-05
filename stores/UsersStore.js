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
            try {
                const { data: user, error: userError, pending: pending, refresh: refresh } = await useFetch('/api/create-user', {
                    method: 'POST',
                    body: {
                        "email": data.email,
                        "password": data.password,
                        "role": data.role,
                        "photo": data.photo,
                        "name": data.name,
                    }
                });

                if (userError.value) {
                    throw userError.value;
                }

                await pending.value;

                console.log(user.value.data);
                this.users.push(user.user);

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
                const { data, pending, error, refresh } = await useFetch('/api/delete-user', {
                    method: 'POST',
                    body: {
                        "userId": userId
                    }
                })

                if (error.value) {
                    console.error(error.value);
                    throw new Error('Failed to delete user');
                }

                this.users = this.users.filter(user => user.id !== userId);
                console.log(data.value);
                return { status: 'success' };
            } catch (error) {
                console.error(error);
                return { status: 'error', error };
            } finally {
                this.loading = false;
            }
        },
        async deleteUsers(userIds) {
            this.loading = true;
            try {
                for (let userId of userIds) {
                    const { data, pending, error, refresh } = await useFetch('/api/delete-user', {
                        method: 'POST',
                        body: {
                            "userId": userId
                        }
                    })

                    if (error.value) {
                        console.error(error.value);
                        throw new Error(`Failed to delete user with id ${userId}`);
                    }

                    this.users = this.users.filter(user => user.id !== userId);
                }

                console.log('Delete operation completed');
                return { status: 'success' };
            } catch (error) {
                console.error(error);
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
                throw new Error('Error updating user');
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
