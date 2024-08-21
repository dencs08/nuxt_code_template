import type { BackendClient } from "../types/backend";
import type { UserAuthPublicSession } from "../types/user";

export class SupabaseClient implements BackendClient {
  constructor(private client: any) {}

  //users
  async getUsers(): Promise<any[]> {
    let { data, error } = await this.client.from("users").select(`
        *,
        user_roles!inner (
          role_id,
          roles (
            name,
            access_level
          )
        )
      `);

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "An error occurred while fetching the users",
      });
    }

    if (!data || data.length === 0) {
      throw createError({ statusCode: 404, statusMessage: "No users found" });
    }

    const users = data.map((user: any) => {
      const roleName = user.user_roles?.roles?.name || "No role assigned";
      const roleData = user.user_roles
        ? {
            role_id: user.user_roles.role_id,
            name: user.user_roles.roles.name,
            access_level: user.user_roles.roles.access_level,
          }
        : {
            role_id: null,
            name: "No role assigned",
            access_level: null,
          };

      delete user.user_roles;
      return {
        ...user,
        role: roleName,
        role_data: roleData,
      };
    });

    return users;
  }

  async getUser(userId: string): Promise<any> {
    let user = {} as any;
    let { data, error } = await this.client
      .from("users")
      .select(
        `
        *,
        user_roles (
            role_id
        )
      `
      )
      .eq("id", userId)
      .single();

    if (data) {
      const roleName = await this.getRoleName(data.user_roles?.role_id);
      user = { ...data, role: roleName };
      delete user.user_roles;
    }

    if (error) {
      // throw createError({
      //   statusCode: 500,
      //   statusMessage: error.message,
      // });
      throw error;
    }

    return user;
  }
  async getAuthUsers(): Promise<any[]> {
    let { data: authData, error: authError } =
      await this.client.auth.admin.listUsers();
    if (authError) {
      throw authError;
    }

    return authData;
  }
  async createUser(
    body: {
      name: string;
      email: string;
      password: string;
      role_id: string;
      photo?: string;
    },
    event: any,
    userSession: any
  ): Promise<UserAuthPublicSession> {
    console.log("Creating user with email:", body.email);
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
      console.error("Error creating user:", error);
      throw createError({
        statusCode: error.code,
        statusMessage: error.message,
        message: error.message,
      });
    }

    console.log("User created with ID:", data.user.id);

    try {
      console.log("Assigning role to user:", data.user.id);
      await this.assignRole(data.user.id, body.role_id, userSession);
      console.log("Role assigned successfully to user:", data.user.id);
    } catch (err) {
      console.error("Error assigning role to user:", err);
      console.log(
        "Deleting user due to role assignment failure:",
        data.user.id
      );
      await this.deleteUser(data.user.id);
      throw err;
    }

    const user: UserAuthPublicSession = {
      id: data.user.id,
      name: body.name,
      email: body.email,
      phone: "",
      photo: body.photo,
      role: body.role_id,
      provider: data.user.app_metadata.provider,
    };

    console.log("User creation and role assignment successful:", user);
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
        .select("*, user_roles!inner(role_id)")
        .eq("id", userId)
        .single()) as { data: UserAuthPublicSession | null };

      if (user) {
        let roleName = await this.getRoleName(user.user_roles?.role_id);
        user.role = roleName;
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
  async assignRole(userId: string, roleId: string, userSession: any) {
    const userRole = await this.getUserRole(userSession.id);

    // Check if the role exists
    const { data: roleData, error: roleError } = await this.client
      .from("roles")
      .select("id, name, access_level")
      .eq("id", roleId)
      .single();

    if (roleError || !roleData) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error retrieving role data or invalid role_id",
      });
    }

    // Get the current user's role
    const { data: currentUserData, error: currentUserError } = await this.client
      .from("user_roles")
      .select("role_id")
      .eq("user_id", userId)
      .single();

    if (currentUserError && currentUserError.code !== "PGRST116") {
      throw createError({
        statusCode: currentUserError.code,
        statusMessage: currentUserError.message,
      });
    }

    const currentRoleId = currentUserData?.role_id;
    const currentRole = currentRoleId
      ? await this.getRoleById(currentRoleId)
      : null;

    // Implement role-based access control
    if (
      userRole.name === "admin" &&
      (currentRole?.name === "admin" || currentRole?.name === "superadmin")
    ) {
      throw createError({
        statusCode: 403,
        statusMessage:
          "Admins cannot change the role of other admins or superadmins",
      });
    }

    if (userRole.name !== "superadmin" && roleData.name === "superadmin") {
      throw createError({
        statusCode: 403,
        statusMessage: "Only superadmins can assign the superadmin role",
      });
    }

    try {
      const { data, error } = await this.client
        .from("user_roles")
        .upsert({
          user_id: userId,
          role_id: roleId,
        })
        .eq("user_id", userId)
        .select();

      if (error) {
        throw createError({
          statusCode: error.code,
          statusMessage: error.message,
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
  private async getRoleName(roleId: number): Promise<string | null> {
    if (!roleId) return null;

    let { data, error } = await this.client
      .from("roles")
      .select("*")
      .eq("id", roleId)
      .single();

    if (error) {
      console.error("Error fetching role name:", error);
      return "Unknown Role";
    }

    return data?.name || "Unknown Role";
  }

  //me
  async getMe(): Promise<any> {
    const userSession = await this.getCurrentUser();
    return userSession;
  }
  async deleteMe(userSession: any): Promise<any> {
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

    const { data, error } = await this.client.auth.admin.deleteUser(
      userSession!.id
    );
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error deleting authentication data",
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
  async getMePermissions(userId: string): Promise<any> {
    try {
      let { data: userPermissions, error: userPermissionsError } =
        await this.client
          .from("user_permissions")
          .select("*")
          .eq("user_id", userId);

      if (userPermissionsError) {
        throw createError({
          statusCode: userPermissionsError.code,
          statusMessage: userPermissionsError?.message,
        });
      }

      const permissionIds = userPermissions.map(
        (perm: any) => perm.permission_id
      );

      let { data: permissions, error: permissionsError } = await this.client
        .from("permissions")
        .select("name, resource, action")
        .in("id", permissionIds);

      if (permissionsError) {
        throw createError({
          statusCode: permissionsError.code,
          statusMessage: permissionsError?.message,
        });
      }

      return permissions || [];
    } catch (error) {
      console.error("Unexpected error in getMePermissions:", error);
      throw error;
    }
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

  //permissions
  async getPermissions(userId: string): Promise<any> {
    let { data: userPermissions, error: userPermissionsError } =
      await this.client
        .from("user_permissions")
        .select("*")
        .eq("user_id", userId);

    if (userPermissionsError) {
      throw createError({
        statusCode: userPermissionsError.code,
        statusMessage: userPermissionsError?.message,
      });
    }

    const permissionIds = userPermissions.map(
      (perm: any) => perm.permission_id
    );

    let { data: permissions, error: permissionsError } = await this.client
      .from("permissions")
      .select("*")
      .in("id", permissionIds);

    if (permissionsError) {
      throw createError({
        statusCode: permissionsError.code,
        statusMessage: permissionsError?.message,
      });
    }

    return permissions;
  }
  async updatePermissions(userId: string, permissions: any[]): Promise<any> {
    // Fetch all available permissions
    const availablePermissions = await this.getAvailablePermissions();

    // Fetch existing user permissions
    const { data: existingUserPermissions, error: fetchError } =
      await this.client
        .from("user_permissions")
        .select("permission_id")
        .eq("user_id", userId);

    if (fetchError) {
      throw createError({
        statusCode: fetchError.code,
        statusMessage: fetchError.message,
      });
    }

    const existingPermissionIds = new Set(
      existingUserPermissions.map((p: any) => p.permission_id)
    );

    let permissionsToAdd = [];
    let permissionsToRemove = [];

    for (const perm of permissions) {
      for (const [action, value] of Object.entries(perm.action)) {
        const availablePerm = availablePermissions.find(
          (ap: any) => ap.resource === perm.resource && ap.action === action
        );

        if (!availablePerm) {
          console.warn(`Permission not found: ${perm.resource} - ${action}`);
          continue;
        }

        if (value && !existingPermissionIds.has(availablePerm.id)) {
          permissionsToAdd.push({
            user_id: userId,
            permission_id: availablePerm.id,
          });
        } else if (!value && existingPermissionIds.has(availablePerm.id)) {
          permissionsToRemove.push(availablePerm.id);
        }
      }
    }

    if (permissionsToRemove.length > 0) {
      const { error: removeError } = await this.client
        .from("user_permissions")
        .delete()
        .eq("user_id", userId)
        .in("permission_id", permissionsToRemove);

      if (removeError) {
        throw createError({
          statusCode: removeError.code,
          statusMessage: removeError.message,
        });
      }
    }

    if (permissionsToAdd.length > 0) {
      const { error: addError } = await this.client
        .from("user_permissions")
        .insert(permissionsToAdd);

      if (addError) {
        throw createError({
          statusCode: addError.code,
          statusMessage: addError.message,
        });
      }
    }

    return {
      success: true,
      added: permissionsToAdd.length,
      removed: permissionsToRemove.length,
    };
  }
  async getAvailablePermissions(): Promise<any> {
    let { data: permissions, error: permissionsError } = await this.client
      .from("permissions")
      .select("id, name, resource, action");

    if (permissionsError) {
      throw createError({
        statusCode: permissionsError.code,
        statusMessage: permissionsError?.message,
      });
    }

    return permissions;
  }

  //roles
  async getRoles(): Promise<any[]> {
    const { data, error } = await this.client
      .from("roles")
      .select("*")
      .order("access_level", { ascending: true });

    if (error) {
      throw createError({
        statusCode: error.code,
        statusMessage: error.message,
      });
    }

    return data;
  }
  async getRolePermissions(roleId: number): Promise<any[]> {
    const { data, error } = await this.client
      .from("role_permissions")
      .select("permissions(id, name, action, resource)")
      .eq("role_id", roleId);

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error fetching role permissions",
      });
    }

    return data.map((item: any) => item.permissions);
  }
  async addRolePermission(roleId: number, permissionId: number): Promise<void> {
    const { error } = await this.client
      .from("role_permissions")
      .insert({ role_id: roleId, permission_id: permissionId });

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error adding role permission",
      });
    }
  }
  async removeRolePermission(
    roleId: number,
    permissionId: number
  ): Promise<void> {
    const { error } = await this.client
      .from("role_permissions")
      .delete()
      .eq("role_id", roleId)
      .eq("permission_id", permissionId);

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error removing role permission",
      });
    }
  }
  async getUserPermissions(userId: string): Promise<string[]> {
    const { data: roleData, error: roleError } = await this.client
      .from("user_roles")
      .select("role_id")
      .eq("user_id", userId)
      .single();

    if (roleError) {
      // throw createError({
      //   statusCode: 500,
      //   statusMessage: "Error fetching user role",
      // });
      throw roleError;
    }

    const roleId = roleData.role_id;

    const { data: rolePermissions, error: permissionsError } = await this.client
      .from("role_permissions")
      .select("permissions(name)")
      .eq("role_id", roleId);

    if (permissionsError) {
      // throw createError({
      //   statusCode: 500,
      //   statusMessage: "Error fetching role permissions",
      // });
      throw permissionsError;
    }

    const { data: userPermissions, error: userPermissionsError } =
      await this.client
        .from("user_permissions")
        .select("permissions(name)")
        .eq("user_id", userId);

    if (userPermissionsError) {
      // throw createError({
      //   statusCode: 500,
      //   statusMessage: "Error fetching user permissions",
      // });
      throw userPermissionsError;
    }

    const allPermissions = [
      ...rolePermissions.map((rp: any) => rp.permissions.name),
      ...userPermissions.map((up: any) => up.permissions.name),
    ];

    return [...new Set(allPermissions)];
  }
  async getUserRole(userId: string): Promise<any> {
    const { data, error } = await this.client
      .from("user_roles")
      .select("roles(id, name, access_level)")
      .eq("user_id", userId)
      .single();

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error fetching user role",
      });
    }

    return data.roles;
  }
  async updateRole(roleId: number, accessLevel: number): Promise<any> {
    const { data, error } = await this.client
      .from("roles")
      .update({ access_level: accessLevel })
      .eq("id", roleId);

    if (error) {
      throw createError({
        statusCode: error.code,
        statusMessage: error.message,
      });
    }
    return { success: true };
  }
  async getRoleById(roleId: number): Promise<any> {
    const { data, error } = await this.client
      .from("roles")
      .select("*")
      .eq("id", roleId)
      .single();

    if (error) {
      throw createError({
        statusCode: error.code,
        statusMessage: error.message,
      });
    }

    return data;
  }

  //newsletter
  async addNewsletterSubscriber(email: string): Promise<any> {
    try {
      const { data, error } = await this.client
        .from("newsletter_subscribers")
        .upsert({ email })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          throw createError({
            statusCode: 409,
            statusMessage: "Email already subscribed",
          });
        }
        throw createError({
          statusCode: 400,
          statusMessage: error.message,
        });
      }

      return { success: true, data };
    } catch (error: any) {
      if (error.statusCode && error.statusMessage) {
        throw error;
      }

      throw createError({
        statusCode: 500,
        statusMessage: "An unexpected error occurred",
      });
    }
  }

  async deleteNewsletterSubscriber(email: string): Promise<any> {
    const { data, error } = await this.client
      .from("newsletter_subscribers")
      .delete()
      .eq("email", email);

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }

    return data;
  }

  async getNewsletterSubscribers(): Promise<any> {
    const { data, error } = await this.client
      .from("newsletter_subscribers")
      .select("id, email, created_at")
      .order("created_at", { ascending: false });

    if (error)
      throw createError({ statusCode: 400, statusMessage: error.message });
    return { success: true, data };
  }
}
