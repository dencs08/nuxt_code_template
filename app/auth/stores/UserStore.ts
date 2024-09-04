const { CustomError } = useCustomError();
import { type UserAuthPublicSession as User } from "~~/types/user";

export const useUserStore = defineStore({
  id: "userStore",
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    loading: false,
  }),
  getters: {
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
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
    async fetchUser() {
      this.loading = true;
      try {
        const user = await useAuthentication().getUser();
        this.setUser(user);
      } catch (error) {
        this.clearUser();
        const errorMessage =
          (error as { data?: { message: string } })?.data?.message ||
          "An unknown error occurred";
        throw new CustomError(errorMessage, error);
      } finally {
        this.loading = false;
      }
    },
    setUser(user: User | null) {
      this.user = user;
      this.isAuthenticated = !!user;
    },
    clearUser() {
      this.user = null;
      this.isAuthenticated = false;
    },
    async updateUserAccount(profileData: Partial<User>) {
      this.loading = true;
      try {
        const { error } = (await $fetch("/api/me", {
          method: "PATCH",
          body: profileData,
        })) as { error?: any };
        if (error) {
          throw new CustomError("Error updating user data", error);
        }

        await this.fetchUser();
        return { response: "Profile updated" };
      } catch (e) {
        throw new CustomError("An error occurred during the update process", e);
      } finally {
        this.loading = false;
      }
    },

    async updateUserEmail(email: string, emailRedirectTo?: string) {
      const { updateEmail } = await useAuthentication();

      this.loading = true;
      try {
        if (email && email !== this.user.email) {
          await updateEmail(email, emailRedirectTo);
        }
        return { response: "Verification link sent" };
      } catch (e) {
        throw new CustomError("An error occurred during the update process", e);
      } finally {
        this.loading = false;
      }
    },

    async deleteUserAccount() {
      const { signOut } = await useAuthentication();

      this.loading = true;
      try {
        const { error } = (await $fetch("/api/me", {
          method: "DELETE",
        })) as { error?: any };
        if (error) {
          throw new CustomError("Error deleting the account", error);
        }
      } catch (error) {
        // console.error(error);
        throw new CustomError("Failed to delete the account", error);
      } finally {
        this.loading = false;
        signOut();
      }
    },
  },
});
