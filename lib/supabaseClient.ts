import type { BackendClient } from "../types/backend";

export class SupabaseClient implements BackendClient {
  constructor(private client: any) {}

  async getUsers(): Promise<any[]> {
    const { data, error } = await this.client.from("users").select("*");
    if (error) throw new Error(error.message);
    return data;
  }

  async getCurrentUser(): Promise<any[]> {
    const {
      data: { user },
      error,
    } = await this.client.auth.getUser();

    if (error) {
      throw createError({ statusMessage: error?.message });
    }

    const additionalFields = await this.getAdditionalUserFields(user.id);

    const provider = user.app_metadata.provider;

    return {
      ...user,
      ...additionalFields,
      provider,
    };
  }

  private async getAdditionalUserFields(userId: string) {
    if (!userId) {
      return null;
    }

    try {
      const { data: user } = (await this.client
        .from("users")
        .select("*, user_roles!inner(role)")
        .eq("id", userId)
        .single()) as { data: UserAuthPublicSession | null };

      if (user) {
        user.role = user.user_roles.role;
        delete user.user_roles;
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
