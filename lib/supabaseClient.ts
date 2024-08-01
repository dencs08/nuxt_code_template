import message from "~/assets/primevue/lara/message";
import type { BackendClient } from "../types/backend";

export class SupabaseClient implements BackendClient {
  constructor(private client: any) {}

  async getUsers(): Promise<any[]> {
    let users = [];
    let { data, error } = await this.client.from("users").select(`
      *,
      user_roles (
          role
      )
  `);

    if (!data || data.length === 0)
      throw createError({ statusCode: 404, statusMessage: "No users found" });

    users = await data.map((user: any) => {
      const newUser = {
        ...user,
        role: user.user_roles ? user.user_roles.role : "No role assigned",
      };
      delete newUser.user_roles;
      return newUser;
    });

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "An error occurred while fetching the users",
      });
    }

    return users;
  }

  async getAuthUsers(): Promise<any[]> {
    let { data: authData, error: authError } =
      await this.client.auth.admin.listUsers();
    if (authError) {
      throw authError;
    }

    return authData;
  }

  async createUser(body: any): Promise<any> {
    const { data, error } = await this.client.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: {
        full_name: body.name,
        avatar_url: body.photo,
      },
    });

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error creating user: " + error.message,
      });
    }

    body = { ...body, id: data.user.id };
    try {
      await assignRole(event, body);
    } catch (err) {
      const { error: removeError } = await this.client.auth.admin.deleteUser(
        data.user.id
      );
      const { data: deletedUser, error: deleteError } = await this.client
        .from("users")
        .delete()
        .eq("id", data.user.id);

      throw createError({
        statusCode: 500,
        statusMessage: "Error creating user, deleted redundant data.",
      });
    }

    const user: UserAuthPublicSession = {
      id: data.user.id,
      name: body.name,
      email: body.email,
      phone: "",
      photo: body.photo,
      role: body.role,
      provider: data.user.app_metadata.provider,
    };

    return user;
  }

  async updateUser(user: any): Promise<any> {
    const { data, error } = await this.client
      .from("users")
      .upsert({
        id: user.id,
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        // name: userSession.user_metadata.full_name,
        // email: userSession.email,
        // phone: userSession.phone,
        // photo: userSession.user_metadata.avatar_url,
        // last_signin: userSession.last_sign_in_at
      })
      .eq("id", user.id) // Make sure to update only the passed body.id
      .select();

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error updating user data",
      });
    }
    return { message: "User updated" };
  }

  async deleteUser(userId: string): Promise<void> {
    const { data: deletedUser, error: deleteError } = await this.client
      .from("users")
      .delete()
      .eq("id", userId);
    if (deleteError) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error deleting user from public.users",
      });
    }

    const { data, error } = await this.client.auth.admin.deleteUser(userId);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error deleting user from auth.users",
      });
    }
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
