const { CustomError } = useCustomError();

export const useUsersStore = defineStore({
  id: "usersStore",

  state: () => ({
    users: [],
    loading: false,
  }),

  getters: {
    totalCount(state) {
      return state.users.length;
    },
  },

  actions: {
    async fetchUsers() {
      this.loading = true;

      try {
        const data = await $fetch("/api/users", { method: "GET" });
        this.users = data.response;
      } catch (error) {
        throw new CustomError(error.message, error);
      } finally {
        this.loading = false;
      }
    },
    async fetchUser(userId) {
      this.loading = true;

      try {
        const data = await $fetch(`/api/users/${userId}`, { method: "GET" });
        return data.response;
      } catch (error) {
        // throw new CustomError(error.message, error);
      } finally {
        this.loading = false;
      }
    },
    async addUser(req) {
      this.loading = true;
      try {
        const data = await $fetch("/api/users", {
          method: "POST",
          body: {
            name: req.name,
            email: req.email,
            password: req.password,
            role_id: req.role_id,
            photo: req.photo,
          },
        });
        this.users.push(data.response);
      } catch (error) {
        throw new CustomError("Error occured during creation process.", error);
      } finally {
        this.loading = false;
      }
    },
    async deleteUser(userId) {
      this.loading = true;
      try {
        const { data } = await $fetch("/api/users", {
          method: "DELETE",
          body: {
            userId: userId,
          },
        });

        this.users = this.users.filter((user) => user.id !== userId);
        return { status: "success" };
      } catch (error) {
        throw new CustomError(error.message, error);
      } finally {
        this.loading = false;
      }
    },
    async deleteUsers(userIds) {
      this.loading = true;
      try {
        for (let userId of userIds) {
          const { data } = await $fetch("/api/users", {
            method: "DELETE",
            body: {
              userId: userId,
            },
          });
          this.users = this.users.filter((user) => user.id !== userId);
        }

        return { status: "success" };
      } catch (error) {
        throw new CustomError(error.message, error);
      } finally {
        this.loading = false;
      }
    },
    async updateUser(index, req) {
      this.loading = true;
      try {
        this.updateLocalUsers(index, req);
        const { data } = await $fetch("/api/users", {
          method: "PATCH",
          body: {
            id: req.id,
            name: req?.name,
            email: req?.email,
            phone: req?.phone,
            photo: req?.photo,
          },
        });
      } catch (error) {
        throw new CustomError(error.message, error);
      } finally {
        this.loading = false;
        // return updateData.value || 'User updated successfully';
      }
    },
    async updateRole(index, req) {
      this.loading = true;
      try {
        // Check if role is not a number
        if (typeof req.role !== "number") {
          // Find the role ID by name from rolesStore
          const rolesStore = useRolesStore();
          const role = rolesStore.roles.find((r) => r.name === req.role);
          if (role) {
            req.role_id = role.id;
          } else {
            throw new Error(`Role name "${req.role}" not found`);
          }
        } else {
          req.role_id = req.role;
        }

        this.updateLocalUsers(index, req);
        const { data } = await $fetch(`/api/users/role/${req.id}`, {
          method: "POST",
          body: {
            id: req.id,
            role_id: req.role_id,
          },
        });
      } catch (error) {
        throw new CustomError(error.message, error);
      } finally {
        this.loading = false;
      }
    },
    async updateLocalUsers(index, data) {
      this.users[index] = data;
    },
  },
});
