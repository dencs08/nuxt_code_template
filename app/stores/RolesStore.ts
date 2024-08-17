import { defineStore } from "pinia";
import type { Role } from "../../types/roles";
import { roles } from "../../config/common/roles";

export const useRolesStore = defineStore("roles", {
  state: () => ({
    roles: roles as Role[],
    selectedRole: null as Role | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getRoleById: (state) => (id: number) =>
      state.roles.find((role) => role.id === id),
    getRoleByName: (state) => (name: string) =>
      state.roles.find((role) => role.name === name),
    getRoles: (state) => state.roles,
  },

  actions: {
    async fetchRoles() {
      this.loading = true;
      this.error = null;
      try {
        const data = await $fetch("/api/roles", { method: "GET" });
        if (data) {
          //@ts-ignore //not sure why its not recognizing the response property on data...
          this.roles = data.response;
          // console.log("Roles fetched:", this.roles);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        this.error = "Failed to fetch roles";
      } finally {
        this.loading = false;
      }
    },

    async updateRole(roleId: number, accessLevel: number) {
      this.loading = true;
      this.error = null;
      try {
        await $fetch(`/api/roles/${roleId}`, {
          method: "PUT",
          body: { access_level: accessLevel },
        });

        // Update the role in the local state
        const roleIndex = this.roles.findIndex((role) => role.id === roleId);
        if (roleIndex !== -1) {
          this.roles[roleIndex].access_level = accessLevel;
        }
      } catch (error) {
        console.error("Error updating role:", error);
        this.error = "Failed to update role";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    getRoleSeverity(roleValue: string) {
      switch (roleValue) {
        case "enduser":
          return "";
        case "guest":
          return "contrast";
        case "subscriber":
          return "info";
        case "manager":
          return "success";
        case "admin":
          return "warn";
        case "superadmin":
          return "danger";
        default:
          return null;
      }
    },
    async clearRoles() {
      this.roles = [];
    },
    selectRole(role: Role) {
      this.selectedRole = role;
    },
    // async createRole(name: string, accessLevel: number) {
    //   this.loading = true;
    //   this.error = null;
    //   try {
    //     const newRole = await $fetch("/api/roles", {
    //       method: "POST",
    //       body: { name, access_level: accessLevel },
    //     });
    //     this.roles.push(newRole as Role);
    //   } catch (error) {
    //     console.error("Error creating role:", error);
    //     this.error = "Failed to create role";
    //     throw error;
    //   } finally {
    //     this.loading = false;
    //   }
    // },

    // async deleteRole(roleId: number) {
    //   this.loading = true;
    //   this.error = null;
    //   try {
    //     await $fetch(`/api/roles/${roleId}`, {
    //       method: "DELETE",
    //     });
    //     this.roles = this.roles.filter((role) => role.id !== roleId);
    //   } catch (error) {
    //     console.error("Error deleting role:", error);
    //     this.error = "Failed to delete role";
    //     throw error;
    //   } finally {
    //     this.loading = false;
    //   }
    // },
  },
});
