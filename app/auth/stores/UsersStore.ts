import { defineStore } from "pinia";

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role_id?: number;
  photo?: string;
  phone?: string;
}

interface UserState {
  users: User[];
  loading: boolean;
}

export interface AddUserRequest {
  email: string;
  name: string;
  password: string;
  role_id: number;
  photo?: string;
}

interface UpdateUserRequest {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  photo?: string;
}

interface UpdateRoleRequest {
  id: number;
  role: number | string;
  role_id?: number;
}

export const useUsersStore = defineStore({
  id: "usersStore",

  state: (): UserState => ({
    users: [],
    loading: false,
  }),

  getters: {
    totalCount: (state: UserState): number => {
      return state.users.length;
    },
  },

  actions: {
    async fetchUsers(force: boolean = false): Promise<void> {
      this.loading = true;

      try {
        const query = force ? "?force=true" : "";
        const response = await $fetch<{ data: User[] }>(
          `/api/v1/users${query}`,
          {
            method: "GET",
            retry: 0,
          }
        );
        this.users = response.data;
      } catch (error: any) {
        console.log(error.data);
        throw createError({
          statusCode: error.status,
          statusMessage: error.data.statusMessage,
        });
      } finally {
        this.loading = false;
      }
    },

    async fetchUser(userId: number): Promise<User | undefined> {
      this.loading = true;

      try {
        const response = await $fetch<{ response: User }>(
          `/api/v1/users/${userId}`,
          { method: "GET" }
        );
        return response.data;
      } catch (error) {
        // Uncomment the following line if you want to throw the error
        // throw new CustomError((error as Error).message, error);
      } finally {
        this.loading = false;
      }
    },

    async addUser(userData: any) {
      this.loading = true;
      try {
        const response = await $fetch("/api/v1/users", {
          method: "POST",
          body: userData,
        });

        if (response && response.data) {
          this.users.push(response.data);
        }
      } catch (error) {
        console.error("Error adding user:", error);
        throw error; // Re-throw the error to be caught by the calling component
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(userId: number): Promise<{ status: string }> {
      this.loading = true;
      try {
        await $fetch("/api/v1/users", {
          method: "DELETE",
          body: { userId },
        });

        this.users = this.users.filter((user) => user.id !== userId);
        return { status: "success" };
      } catch (error) {
        throw new CustomError((error as Error).message, error);
      } finally {
        this.loading = false;
      }
    },

    async deleteUsers(userIds: number[]): Promise<{ status: string }> {
      this.loading = true;
      try {
        for (let userId of userIds) {
          await $fetch("/api/v1/users", {
            method: "DELETE",
            body: { userId },
          });
          this.users = this.users.filter((user) => user.id !== userId);
        }

        return { status: "success" };
      } catch (error) {
        throw new CustomError((error as Error).message, error);
      } finally {
        this.loading = false;
      }
    },

    async updateUser(index: number, req: UpdateUserRequest): Promise<void> {
      this.loading = true;
      try {
        this.updateLocalUsers(index, req);
        await $fetch("/api/v1/users", {
          method: "PATCH",
          body: req,
        });
      } catch (error) {
        throw new CustomError((error as Error).message, error);
      } finally {
        this.loading = false;
      }
    },

    async updateRole(index: number, req: UpdateRoleRequest): Promise<void> {
      this.loading = true;
      try {
        if (typeof req.role !== "number") {
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
        await $fetch(`/api/v1/users/role/${req.id}`, {
          method: "POST",
          body: {
            id: req.id,
            role_id: req.role_id,
          },
        });
      } catch (error) {
        throw new CustomError((error as Error).message, error);
      } finally {
        this.loading = false;
      }
    },

    updateLocalUsers(index: number, data: Partial<User>): void {
      this.users[index] = { ...this.users[index], ...data };
    },

    async inviteUser(email: string): Promise<void> {
      try {
        const { error } = await $fetch("/api/v1/users/invite", {
          method: "POST",
          body: { email },
        });
        if (error) {
          throw new CustomError("Error inviting a user", error);
        }
      } catch (error) {
        throw new CustomError("Failed to invite this user", error);
      }
    },

    async banUser(id: number, duration: number): Promise<void> {
      try {
        const { error } = await $fetch("/api/v1/users/ban", {
          method: "POST",
          body: { id, duration },
        });
        if (error) {
          throw new CustomError("Error banning the user", error);
        }
      } catch (error) {
        throw new CustomError("Failed to ban this user", error);
      }
    },

    async sendPasswordResetEmail(email: string): Promise<void> {
      try {
        const { error } = await $fetch("/api/v1/users/send-reset-password", {
          method: "POST",
          body: { email },
        });
        if (error) {
          throw new CustomError("Error sending password reset email", error);
        }
      } catch (error) {
        throw new CustomError("Failed to send password reset email", error);
      }
    },

    async changeUserPassword(id: number, password: string): Promise<void> {
      try {
        const { error } = await $fetch("/api/v1/users/change-password", {
          method: "POST",
          body: { id, password },
        });
        if (error) {
          console.log(error);
          throw new CustomError("Error changing user password", error);
        }
        console.log("Password changed");
      } catch (error) {
        throw new CustomError("Failed to change user password", error);
      }
    },
  },
});
