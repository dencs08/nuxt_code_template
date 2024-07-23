import { type UserAuthPublicSession } from "../utils/types";

//TODO check if it still works after the refactor to own service wrapper
export function useUser() {
  const client = useSupabaseClient();
  // const userAuthSession = useSupabaseUser();
  const usersStore = useUsersStore();
  const userAuthSession = usersStore.getUser;

  const { CustomError } = useCustomError();
  const { updateEmail, getUser } = useAuthentication();
  const { addToast } = useToastService();
  const { checkProvider } = useProvider();

  const updateProfile = async (profileData: Partial<UserAuthPublicSession>) => {
    try {
      const { error } = await client
        .from("users")
        //@ts-ignore
        .update({
          name: profileData.name,
          phone: profileData.phone,
        })
        .eq("id", userAuthSession.value.id)
        .select();

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
      if (email && email !== userAuthSession.value.email) {
        if (!checkProvider("email")) return;
        await updateEmail(email, emailRedirectTo);
        addToast(
          "warn",
          "Verify email change",
          `To change the email, click on the verification link sent to ${email}`,
          60000
        );

        //update email_change and token in public.users
        const { error } = await client
          .from("users")
          //@ts-ignore
          .update({
            new_email: email,
          })
          .eq("id", userAuthSession.value.id)
          .select();

        if (error) {
          throw new CustomError("Error updating user data", error);
        }
      }
      return { response: "Verification link sent" };
    } catch (e) {
      throw new CustomError("An error occurred during the update process", e);
    }
  };

  return { updateProfile, updateUserEmail };
}
