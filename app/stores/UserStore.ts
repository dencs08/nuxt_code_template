const { CustomError } = useCustomError();
import type { UserAuthPublicSession as User } from "@/utils/types";

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
  },
});
