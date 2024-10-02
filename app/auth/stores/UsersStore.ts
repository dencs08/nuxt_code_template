import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { PaginationParams, PaginatedResponse } from "~~/types/pagination";

interface User {
  id: number;
  name: string;
  nickname: string;
  email: string;
  password?: string;
  role_id?: number;
  photo?: string;
  phone?: string;
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

export const useUsersStore = defineStore("usersStore", () => {
  const users = ref<User[]>([]);
  const loading = ref(false);
  const totalRecords = ref(0);
  const totalQueryRecords = ref(0);
  const currentPage = ref(1);
  const rowsPerPage = ref(10);

  const totalCount = computed(() => users.value.length);

  function addOrUpdateUsers(newUsers: User[]): void {
    newUsers.forEach((newUser) => {
      const index = users.value.findIndex((user) => user.id === newUser.id);
      if (index !== -1) {
        // Update existing user
        users.value[index] = { ...users.value[index], ...newUser };
      } else {
        // Add new user
        users.value.push(newUser);
      }
    });
  }

  async function fetchUsers(params: PaginationParams = {}): Promise<void> {
    loading.value = true;

    const queryParams = {
      ...params,
      offset: ((currentPage.value - 1) * rowsPerPage.value).toString(),
      limit: rowsPerPage.value.toString(),
      force: params.force ? "true" : "false",
      filters: JSON.stringify(params.filters || {}),
      sortField: params.sortField,
      sortOrder: params.sortOrder,
    };

    try {
      const response = await $fetch<{ data: User[] }>("/api/v1/users", {
        method: "GET",
        retry: 0,
        query: queryParams,
      });
      addOrUpdateUsers(response.data.data);
      totalRecords.value = response.data.totalRecords;
      totalQueryRecords.value = response.data.totalQueryRecords;
    } catch (error: any) {
      console.log(error.data);
      throw createError({
        statusCode: error.status,
        statusMessage: error.data.statusMessage,
      });
    } finally {
      loading.value = false;
    }
  }

  async function fetchAllUsers(force = false): Promise<void> {
    loading.value = true;
    try {
      const response = await $fetch<{ data: User[] }>("/api/v1/users", {
        method: "GET",
        retry: 0,
        query: { force: force ? "true" : "false" },
      });
      users.value = response.data.data;
      totalRecords.value = response.data.totalRecords;
      totalQueryRecords.value = response.data.totalQueryRecords;
    } catch (error: any) {
      console.log(error.data);
      throw createError({
        statusCode: error.status,
        statusMessage: error.data.statusMessage,
      });
    } finally {
      loading.value = false;
    }
  }

  async function fetchUser(userId: number): Promise<User | undefined> {
    loading.value = true;

    try {
      const response = await $fetch<{ response: User }>(
        `/api/v1/users/${userId}`,
        { method: "GET" }
      );
      return response.data;
    } catch (error) {
    } finally {
      loading.value = false;
    }
  }

  async function addUser(userData: any) {
    loading.value = true;
    try {
      const response = await $fetch("/api/v1/users", {
        method: "POST",
        body: userData,
      });

      if (response && response.data) {
        users.value.push(response.data);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      throw error; // Re-throw the error to be caught by the calling component
    } finally {
      loading.value = false;
    }
  }

  async function deleteUser(userId: number): Promise<{ status: string }> {
    loading.value = true;
    try {
      await $fetch("/api/v1/users", {
        method: "DELETE",
        body: { userId },
      });

      users.value = users.value.filter((user) => user.id !== userId);
      return { status: "success" };
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: (error as Error).message,
      });
    } finally {
      loading.value = false;
    }
  }

  async function deleteUsers(userIds: number[]): Promise<{ status: string }> {
    loading.value = true;
    try {
      for (let userId of userIds) {
        await $fetch("/api/v1/users", {
          method: "DELETE",
          body: { userId },
        });
        users.value = users.value.filter((user) => user.id !== userId);
      }

      return { status: "success" };
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: (error as Error).message,
      });
    } finally {
      loading.value = false;
    }
  }

  async function updateUser(
    index: number,
    req: UpdateUserRequest
  ): Promise<void> {
    loading.value = true;
    try {
      updateLocalUsers(index, req);
      await $fetch("/api/v1/users", {
        method: "PATCH",
        body: req,
      });
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: (error as Error).message,
      });
    } finally {
      loading.value = false;
    }
  }

  async function updateRole(
    index: number,
    req: UpdateRoleRequest
  ): Promise<void> {
    loading.value = true;
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

      updateLocalUsers(index, req);
      await $fetch(`/api/v1/users/role/${req.id}`, {
        method: "POST",
        body: {
          id: req.id,
          role_id: req.role_id,
        },
      });
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: (error as Error).message,
      });
    } finally {
      loading.value = false;
    }
  }

  function updateLocalUsers(index: number, data: Partial<User>): void {
    users.value[index] = { ...users.value[index], ...data };
  }

  async function inviteUser(email: string): Promise<void> {
    try {
      const response = await $fetch("/api/v1/users/invite", {
        method: "POST",
        body: { email },
      });
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }
  }

  async function banUser(id: number, duration: number): Promise<void> {
    try {
      const response = await $fetch("/api/v1/users/ban", {
        method: "POST",
        body: { id, duration },
      });
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: (error as Error).message,
      });
    }
  }

  async function sendPasswordResetEmail(email: string): Promise<void> {
    try {
      const response = await $fetch("/api/v1/users/send-reset-password", {
        method: "POST",
        body: { email },
      });
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: (error as Error).message,
      });
    }
  }

  async function changeUserPassword(
    id: number,
    password: string
  ): Promise<void> {
    try {
      const response = await $fetch("/api/v1/users/change-password", {
        method: "POST",
        body: { id, password },
      });

      // console.log("Password changed");
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: (error as Error).message,
      });
    }
  }

  function setPage(page: number): void {
    currentPage.value = page;
  }

  function setRowsPerPage(rows: number): void {
    rowsPerPage.value = rows;
  }

  function resetUsers(): void {
    users.value = [];
    totalRecords.value = 0;
    totalQueryRecords.value = 0;
  }

  return {
    users,
    loading,
    totalRecords,
    totalQueryRecords,
    currentPage,
    rowsPerPage,
    totalCount,
    resetUsers,
    fetchUsers,
    fetchAllUsers,
    fetchUser,
    addUser,
    deleteUser,
    deleteUsers,
    updateUser,
    updateRole,
    updateLocalUsers,
    inviteUser,
    banUser,
    sendPasswordResetEmail,
    changeUserPassword,
    setPage,
    setRowsPerPage,
    addOrUpdateUsers,
  };
});
