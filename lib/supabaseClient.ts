import type { BackendClient } from "../types/backend";
import { validRoles } from "@/utils/roles";

export class SupabaseClient implements BackendClient {
  constructor(private client: any) {}

  //users
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
  async createUser(body: any, event: any): Promise<any> {
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
        statusMessage: error,
        message: error,
      });
    }

    body = { id: data.user.id, role: body.role };

    try {
      await this.assignRole(event, body);
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
        statusMessage: deleteError,
        message: deleteError,
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
        statusCode: error.code,
        statusMessage: error.message, //"Error updating user data"
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
        statusCode: deleteError.code,
        statusMessage: deleteError.message, //"Error deleting user from public.users"
      });
    }

    const { data, error } = await this.client.auth.admin.deleteUser(userId);
    if (error) {
      throw createError({
        statusCode: error.code,
        statusMessage: error.message, //"Error deleting user from auth.users"
      });
    }
  }

  //auth
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

  //utils
  async assignRole(event: any, body: { id: string; role: string }) {
    await checkUserRole(event, "admin");

    const userRole = await getUserRole(event);
    if (!validRoles.map((role) => role.value).includes(body.role)) {
      throw createError({
        statusCode: 500,
        statusMessage: "Invalid or missing data",
      });
    }

    const { data: currentUserData, error: currentUserError } = await this.client
      .from("user_roles")
      .select("role")
      .eq("user_id", body.id)
      .single();
    if (currentUserError) {
      throw createError({
        statusCode: currentUserError.code,
        statusMessage: currentUserError.message, //"Error retrieving current user role"
      });
    }

    if (
      userRole === "admin" &&
      (currentUserData.role === "admin" ||
        currentUserData.role === "superadmin")
    ) {
      throw createError({
        statusCode: 500,
        statusMessage:
          "Admins cannot change the role of other admins or superadmins",
      });
    }

    if (userRole !== "superadmin" && body.role === "superadmin") {
      throw createError({
        statusCode: 500,
        statusMessage: "Only superadmins can assign the superadmin role",
      });
    }

    try {
      const { data, error } = await this.client
        .from("user_roles")
        .upsert({
          user_id: body.id,
          role: body.role,
        })
        .eq("user_id", body.id) // Make sure to update only the passed body.id
        .select();

      if (error) {
        throw createError({
          statusCode: error.code,
          statusMessage: error.message, //"Error updating user role"
        });
      }
      return { response: "User role updated" };
    } catch (err: any) {
      throw createError({
        statusCode: err.code,
        statusMessage: err.message,
      });
    }
  }
  async confirmEmail(userSession: any) {
    const { data: publicUser, error } = await this.client
      .from("users")
      .select("*")
      .eq("id", userSession.id)
      .single();

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error confirming email",
      });
    }

    if (
      publicUser.new_email === userSession.new_email &&
      publicUser.new_email != null
    ) {
      const { data, error } = await this.client
        .from("users")
        .update({
          email: publicUser.new_email,
          new_email: null,
        })
        .eq("id", userSession.id);

      if (error) {
        throw createError({
          statusCode: 500,
          statusMessage: "Error confirming email",
        });
      }
    }

    //if supabase already changed the email and removed auth.users.new_email
    if (
      publicUser.new_email != userSession.new_email &&
      publicUser.new_email === userSession.email
    ) {
      const { data, error } = await this.client
        .from("users")
        .update({
          email: publicUser.new_email,
          new_email: null,
        })
        .eq("id", userSession.id);

      if (error) {
        throw createError({
          statusCode: 500,
          statusMessage: "Error confirming email",
        });
      }
    }

    return { response: "Email confirmation successful" };
  }

  //me
  async getMe(): Promise<any> {
    const userSession = await this.getCurrentUser();
    return userSession;
  }
  async deleteMe(userSession: any): Promise<any> {
    const { data, error } = await this.client.auth.admin.deleteUser(
      userSession!.id
    );
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error deleting authentication data",
      });
    }

    const { error: deleteError } = await this.client
      .from("users")
      .delete()
      .eq("id", userSession!.id);
    if (deleteError) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error deleting user data: " + deleteError.message,
      });
    }

    return { response: "User account deleted successfully." };
  }
  async updateMe(user: any, data: any): Promise<any> {
    const { error } = await this.client
      .from("users")
      //@ts-ignore
      .update({
        name: data.name,
        phone: data.phone,
      })
      .eq("id", user.id)
      .select();

    return { response: "User updated" };
  }
  async putMe(user: any, data: any): Promise<any> {}

  async updateMeEmail(user: any, body: any): Promise<any> {
    //update email_change and token in public.users
    const { error } = await this.client
      .from("users")
      //@ts-ignore
      .update({
        new_email: body.email,
      })
      .eq("id", user.id)
      .select();

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error updating user data " + error.message,
      });
    }
  }
  async updateMePhoto(userId: any, photoUrl: any): Promise<any> {
    const { error: userError } = await this.client
      .from("users")
      .update({ photo: photoUrl })
      .eq("id", userId);

    if (userError) {
      throw createError({
        statusCode: 500,
        statusMessage: userError.message,
      });
    }

    return { success: true };
  }

  //storage
  async uploadFile(
    bucketName: string,
    filePath: string,
    file: string,
    contentType: string,
    upsert: boolean
  ): Promise<any> {
    const fileBuffer = Buffer.from(file, "base64");

    const { data, error: uploadError } = await this.client.storage
      .from(bucketName)
      .upload(filePath, fileBuffer, {
        upsert,
        contentType,
      });

    if (uploadError) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error uploading file", //uploadError.message,
      });
    }

    const {
      data: { publicUrl },
    } = this.client.storage.from(bucketName).getPublicUrl(filePath);

    return { publicUrl };
  }

  async deleteFile(bucketName: string, filePath: string): Promise<any> {
    const { error: deleteError } = await this.client.storage
      .from(bucketName)
      .remove([filePath]);

    if (deleteError) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error deleting file",
      });
    }

    return { success: true };
  }
}
