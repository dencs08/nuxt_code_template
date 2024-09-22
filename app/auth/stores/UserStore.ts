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
      return state.user?.name ? state.user.name.split(" ")[0] : null;
    },
    lastName: (state) => {
      if (!state.user?.name) return null;
      const nameParts = state.user.name.split(" ");
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
        const data = (await $fetch("/api/v1/me", {
          method: "PATCH",
          body: profileData,
        })) as { error?: any };

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
        const response = (await $fetch("/api/v1/me", {
          method: "DELETE",
        })) as { success?: boolean; error?: any };

        if (response.success) {
          await signOut();
        }
      } catch (error) {
        // console.error(error);
        throw new CustomError("Failed to delete the account", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
