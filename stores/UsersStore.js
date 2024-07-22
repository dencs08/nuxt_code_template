const { CustomError } = useCustomError();

export const useUsersStore = defineStore({
  id: "usersStore",

  state: () => ({
    users: [],
    loading: false,
    user: null,
  }),

  getters: {
    totalCount(state) {
      return state.users.length;
    },
    getUser: (state) => {
      return state.user;
    },
    firstName: (state) => {
      return state.user ? state.user.name.split(" ")[0] : null;
    },
    lastName: (state) => {
      const nameParts = state.user ? state.user.name.split(" ") : [];
      return nameParts.length > 1 ? nameParts[nameParts.length - 1] : null;
    },
    userRole: (state) => {
      return state.user ? state.user.role : null;
    },
    photo: (state) => {
      return state.user ? state.user.photo : null;
    },
  },

  actions: {
    async fetchUsers() {
      this.loading = true;

      try {
        const data = await $fetch("/api/users", { method: "GET" });
        this.users = data.response;
      } catch (error) {
        throw new CustomError(error.data.message, error);
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
            role: req.role,
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
        throw new CustomError(error.data.message, error);
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

        console.log("Delete operation completed");
        return { status: "success" };
      } catch (error) {
        throw new CustomError(error.data.message, error);
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
        throw new CustomError(error.data.message, error);
      } finally {
        this.loading = false;
        // return updateData.value || 'User updated successfully';
      }
    },
    async updateRole(index, req) {
      this.loading = true;
      try {
        this.updateLocalUsers(index, req);
        const { data } = await $fetch("/api/role", {
          method: "POST",
          body: {
            id: req.id,
            role: req.role,
          },
        });
      } catch (error) {
        throw new CustomError(error.data.message, error);
      } finally {
        this.loading = false;
      }
    },
    async fetchUser() {
      this.loading = true;
      try {
        const user = await useAuthentication().getUser();
        this.user = user;
      } catch (error) {
        console.error("Error in fetchAuthenticatedUser:", error);
        this.user = null;
        console.log("error log", error);
        const errorMessage =
          error?.data?.message || "An unknown error occurred";
        throw new CustomError(errorMessage, error);
      } finally {
        this.loading = false;
      }
    },
    async updateLocalUsers(index, data) {
      this.users[index] = data;
    },
    setUser(user) {
      this.user = user;
    },
  },
});
