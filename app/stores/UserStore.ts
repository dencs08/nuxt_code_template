const { CustomError } = useCustomError();
import type { UserAuthPublicSession as User } from "../utils/types";

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
        console.error("Error in fetchAuthenticatedUser:", error);
        this.clearUser();
        console.log("error log", error);
        const errorMessage =
          (error as { data?: { message: string } })?.data?.message ||
          "An unknown error occurred";
        throw new CustomError(errorMessage, error);
      } finally {
        this.loading = false;
        console.log("fetchUser", this.user);
      }
    },
    // async checkAuth(authProvider: AuthProvider) {
    //   const user = await authProvider.getUser()
    //   if (user) {
    //     this.setUser(user)
    //   } else {
    //     this.clearUser()
    //   }
    // },
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