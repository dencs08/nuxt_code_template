const { CustomError } = useCustomError();

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
        userRole: (state) => {
            return state.userSession ? state.userSession.role : null;
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
                const data = await $fetch('/api/fetch-users')
                this.users = data;
            } catch (error) {
                console.error(error);
                throw new CustomError('Failed to fetch users', error);
            } finally {
                this.loading = false;
            }
        },
        async addUser(req) {
            this.loading = true;
            try {
                const { data } = await $fetch('/api/create-user', {
                    method: 'POST',
                    body: {
                        "email": req.email,
                        "password": req.password,
                        "role": req.role,
                        "photo": req.photo,
                        "name": req.name,
                    }
                });
                this.users.push(data.user);
            } catch (error) {
                console.error(error);
                throw new CustomError('Failed to create a user', error);
            } finally {
                this.loading = false;
            }
        },
        async deleteUser(userId) {
            this.loading = true;
            try {
                const { data } = await $fetch('/api/delete-user', {
                    method: 'POST',
                    body: {
                        "userId": userId
                    }
                })

                this.users = this.users.filter(user => user.id !== userId);
                return { status: 'success' };
            } catch (error) {
                console.error(error);
                throw new CustomError('Failed to delete user', error);
            } finally {
                this.loading = false;
            }
        },
        async deleteUsers(userIds) {
            this.loading = true;
            try {
                for (let userId of userIds) {
                    const { data } = await $fetch('/api/delete-user', {
                        method: 'POST',
                        body: {
                            "userId": userId
                        }
                    })
                    this.users = this.users.filter(user => user.id !== userId);
                }

                console.log('Delete operation completed');
                return { status: 'success' };
            } catch (error) {
                console.error(error);
                throw new CustomError('Failed to delete user', error);
            } finally {
                this.loading = false;
            }
        },
        async updateUser(index, req) {
            this.loading = true;
            try {
                this.updateLocalUsers(index, req);
                const { data } = await $fetch('/api/update-user', {
                    method: 'POST',
                    body: {
                        id: req.id,
                        name: req?.name,
                        email: req?.email,
                        phone: req?.phone,
                        photo: req?.photo,
                    }
                });

            } catch (error) {
                throw new CustomError('Error updating user', error);
            } finally {
                this.loading = false;
                // return updateData.value || 'User updated successfully';
            }
        },
        async updateRole(index, req) {
            this.loading = true;
            try {
                this.updateLocalUsers(index, req);
                const { data } = await $fetch('/api/update-role', {
                    method: 'POST',
                    body: {
                        id: req.id,
                        role: req.role,
                    }
                });
            } catch (error) {
                throw new CustomError('Error updating role', error);

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
                throw new CustomError('Error fetching the user session', error);
            } finally {
                this.loading = false;
            }
        },
        async updateLocalUsers(index, data) {
            this.users[index] = data;
        }
    }
});
