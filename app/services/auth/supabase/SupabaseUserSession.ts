// services/userService.ts
import { type UserAuthPublicSession } from "@/utils/types";
const { CustomError } = useCustomError();
import { type IUserSessionService } from "../UserSessionInterface";

export class SupabaseUserSession implements IUserSessionService {
  async fetchUser(): Promise<UserAuthPublicSession | null> {
    const client = useSupabaseClient();
    const userAuthSession = useSupabaseUser();

    if (!userAuthSession.value) {
      return null;
    }

    try {
      const { data: user } = (await client
        .from("users")
        .select("*, user_roles!inner(role)")
        .eq("id", userAuthSession.value.id)
        .single()) as { data: UserAuthPublicSession | null };

      if (user) {
        user.role = user.user_roles.role;
        delete user.user_roles;
        user.provider = userAuthSession.value.app_metadata.provider;
      }

      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new CustomError(error.message, error);
      } else {
        throw error;
      }
    }
  }
}
