import { type UserAuthPublicSession } from "~~/types/user";

//TODO check if it still works after the refactor to own service wrapper
export function useUser() {
  const userStore = useUserStore();
  const userAuthSession = userStore.getUser;

  const { CustomError } = useCustomError();
  const { updateEmail } = useAuthentication();
  const { addToast } = useToastService();
  const { checkProvider } = useProvider();

  const updateUserAccount = async (
    profileData: Partial<UserAuthPublicSession>
  ) => {
    try {
      const { error } = (await $fetch("/api/me", {
        method: "PATCH",
        body: profileData,
      })) as { error?: any };
      if (error) {
        throw new CustomError("Error updating user data", error);
      }

      return { response: "Profile updated" };
    } catch (e) {
      throw new CustomError("An error occurred during the update process", e);
    }
  };

  const updateUserEmail = async (email: string, emailRedirectTo?: string) => {
    try {
      if (email && email !== userAuthSession.email) {
        if (!checkProvider("email")) return;
        await updateEmail(email, emailRedirectTo);
        addToast(
          "warn",
          "Verify email change",
          `To change the email, click on the verification link sent to ${email}`,
          60000
        );

        const { error } = (await $fetch("/api/me/email", {
          method: "POST",
          body: email,
        })) as { error?: any };
        if (error) {
          throw new CustomError("Error updating user data", error);
        }
      }
      return { response: "Verification link sent" };
    } catch (e) {
      throw new CustomError("An error occurred during the update process", e);
    }
  };

  const deleteUserAccount = async () => {
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
    }
  };

  const confirmUserEmail = async () => {
    try {
      const { data, error } = (await $fetch("/api/auth/confirm-email", {
        method: "POST",
      })) as {
        data?: any;
        error?: any;
      };
      if (error) {
        throw new CustomError("Error occured during confirmation", error);
      }

      return data;
    } catch (error) {
      console.error(error);
      throw new CustomError("Error occured during confirmation", error);
    }
  };

  return {
    updateUserAccount,
    updateUserEmail,
    deleteUserAccount,
    confirmUserEmail,
  };
}
