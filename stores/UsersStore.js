export const useUsersStore = defineStore({
    id: 'usersStore',

    state: () => ({
        users: [],
        loading: false,
        userSession: null
    }),

    getters: {
        totalCount(state) {
            return state.users.length;
        },
        getUserSession: (state) => {
            return state.userSession;
        },
        firstName: (state) => {
            return state.userSession ? state.userSession.name.split(' ')[0] : null;
        },
        lastName: (state) => {
            const nameParts = state.userSession ? state.userSession.name.split(' ') : [];
            return nameParts.length > 1 ? nameParts[nameParts.length - 1] : null;
        }
    },

    actions: {
        async fetchUsers() {
            this.loading = true;

            try {
                const { data: users, pending, error, refresh } = await useFetch('/api/fetch-users')

                if (error.value) {
                    console.error(error);
                    throw new Error('Failed to fetch users');
                }

                this.users = users.value;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch users');
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
                    throw new Error(`Failed to create a user`);
                }

                await pending.value;

                // console.log(user.value.data);
                this.users.push(user.user);

            } catch (error) {
                console.error(error);
                throw new Error(`Failed to create a user`);
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
                    // console.error(error);
                    throw new Error('Failed to delete user');
                }

                this.users = this.users.filter(user => user.id !== userId);
                console.log(data.value);
                return { status: 'success' };
            } catch (error) {
                console.error(error);
                throw new Error(`Failed to delete user`);
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
                        console.error(error);
                        throw new Error(`Failed to delete user with id ${userId}`);
                    }

                    this.users = this.users.filter(user => user.id !== userId);
                }

                console.log('Delete operation completed');
                return { status: 'success' };
            } catch (error) {
                console.error(error);
                throw new Error(`Failed to delete user`);
            } finally {
                this.loading = false;
            }
        },
        async updateUser(index, data) {
            this.loading = true;
            this.updateLocalUsers(index, data);
            try {
                const { data: updateData, pending, error: updateError, refresh } = useFetch('/api/update-user', {
                    method: 'POST',
                    body: {
                        id: data.id,
                        name: data?.name,
                        email: data?.email,
                        phone: data?.phone,
                        photo: data?.photo,
                    }
                });
                if (updateError.value) {
                    throw new Error('Error updating user');
                }

            } catch (error) {
                throw new Error('Error updating user');
            } finally {
                this.loading = false;
                // return updateData.value || 'User updated successfully';
            }
        },
        async updateRole(index, data) {
            this.loading = true;
            this.updateLocalUsers(index, data);
            try {
                const { data: updateData, pending, error: updateError, refresh } = useFetch('/api/update-role', {
                    method: 'POST',
                    body: {
                        id: data.id,
                        role: data.role,
                    }
                });
                if (updateError.value) {
                    throw new Error('Error updating role');
                }
            } catch (error) {
                throw new Error('Error updating role');
            } finally {
                this.loading = false;
            }
        },
        async fetchUserSession() {
            this.loading = true;
            try {
                const { userSession } = useUser();
                const user = await userSession();
                this.userSession = user;
            } catch (error) {
                console.error('Error in fetchAuthenticatedUser:', error);
                this.userSession = null;
                throw new Error('Error fetching the user session');
            } finally {
                this.loading = false;
            }
        },
        async updateLocalUsers(index, data) {
            this.users[index] = data;
        }
    }
});
