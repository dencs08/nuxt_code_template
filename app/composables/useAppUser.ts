import { type UserAuthPublicSession } from "~~/types/user";

import { ref, onMounted } from "vue";
const useStateUser = () => {
  const user = ref<UserAuthPublicSession | null>(null);

  onMounted(() => {
    useAuthentication()
      .getUser()
      .then((fetchedUser: UserAuthPublicSession) => {
        user.value = fetchedUser;
      })
      .catch((error: Error) => {
        console.error("Failed to fetch user:", error);
      });
  });

  return {
    user,
  };
};

export default useStateUser;
