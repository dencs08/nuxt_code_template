import type { BackendClient } from "../types/backend";
import type { UserAuthPublicSession } from "../types/user";
import {
  BaseError,
  DatabaseError,
  NotFoundError,
  AuthorizationError,
} from "~~/server/utils/errors";
import type { EventMetadata } from "~~/types/events";
import type { PaginationParams, Filters } from "~~/types/pagination";
export class SupabaseClient implements BackendClient {
  constructor(private client: any) {}

  //users
  async getUsers(params: PaginationParams): Promise<any> {
    try {
      const tableName = "user_with_auth";
      const columns = [
        "*",
        "user_roles!inner (role_id, roles (name, access_level))",
      ];

      const searchableColumns = [
        "id_text",
        "name",
        "nickname",
        "email",
        "phone",
        "role_name",
      ];

      const query = await this.buildQuery(
        params,
        tableName,
        columns,
        searchableColumns
      );

      const { data: dbUsers, error, count } = await query;

      if (error) {
        console.log(error);
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      if (!dbUsers || dbUsers.length === 0) {
        throw new NotFoundError("No users found");
      }

      const { users: authUsers } = await this.getAuthUsers(params);

      // Map and combine the data
      const users = dbUsers.map((dbUser: any) => {
        const roleName = dbUser.user_roles?.roles?.name || "No role assigned";
        const roleData = dbUser.user_roles
          ? {
              role_id: dbUser.user_roles.role_id,
              name: dbUser.user_roles.roles.name,
              access_level: dbUser.user_roles.roles.access_level,
            }
          : {
              role_id: null,
              name: "No role assigned",
              access_level: null,
            };

        // Find corresponding auth user
        const authUser = authUsers.find((au: any) => au.id === dbUser.id) || {};

        delete dbUser.user_roles;
        return {
          ...dbUser,
          role: roleName,
          role_data: roleData,
          phone: authUser.phone,
        };
      });

      const { count: totalCount, error: totalCountError } = await this.client
        .from(tableName)
        .select("*", { count: "exact", head: true });

      if (totalCountError) {
        throw new DatabaseError(`Database error: ${totalCountError.message}`);
      }

      return {
        data: users,
        totalQueryRecords: count,
        totalRecords: totalCount,
      };
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getAuthUsers(params: PaginationParams): Promise<any> {
    try {
      const { data: authData, error: authError } =
        await this.client.auth.admin.listUsers({
          page:
            Math.floor(
              parseInt(params.offset?.toString() || "0", 10) /
                parseInt(params.limit?.toString() || "10", 10)
            ) + 1,
          perPage: parseInt(params.limit?.toString() || "10", 10),
        });

      if (authError) {
        throw new AuthorizationError(
          `Authorization error: ${authError.message}`
        );
      }

      if (!authData || authData.users.length === 0) {
        throw new NotFoundError("No auth users found");
      }

      return {
        users: authData.users,
        totalQueryRecords: authData.users.length,
        totalRecords: authData.total,
      };
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getUsersByIds(userIds: string[]): Promise<any> {
    try {
      const { data, error } = await this.client
        .from("users")
        .select("*")
        .in("id", userIds);

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      return { data };
    } catch (error: any) {
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getUser(userId: string): Promise<any> {
    try {
      let user = {} as any;

      const { data: userAuth, error: errorAuth } =
        await this.client.auth.admin.getUserById(userId);

      if (errorAuth) {
        throw new AuthorizationError(
          `Authorization error: ${errorAuth.message}`
        );
      }

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

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      if (data) {
        const roleName = await this.getRoleName(data.user_roles?.role_id);
        user = { ...data, role: roleName };
        delete user.user_roles;
      }

      return {
        ...userAuth.user,
        ...user,
      };
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
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
    try {
      const { data, error } = await this.client.auth.admin.createUser({
        email: body.email,
        name: body.name,
        password: body.password,
        email_confirm: true,
        user_metadata: {
          full_name: body.name,
          avatar_url: body.photo,
        },
      });

      if (error) {
        throw new AuthorizationError(`Error creating user: ${error.message}`);
      }

      try {
        console.log("Assigning role to user:", data.user.id);
        await this.assignRole(data.user.id, body.role_id, userSession);
        console.log("Role assigned successfully to user:", data.user.id);
      } catch (err: any) {
        console.error("Error assigning role to user:", err);
        console.log(
          "Deleting user due to role assignment failure:",
          data.user.id
        );
        await this.deleteUser(data.user.id);
        throw new DatabaseError(`Error assigning role: ${err.message}`);
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

      return user;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async updateUser(user: any): Promise<any> {
    try {
      const { data, error } = await this.client
        .from("users")
        .upsert({
          id: user.id,
          name: user?.name,
          nickname: user?.nickname,
        })
        .eq("id", user.id)
        .select();

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      const { data: authUser, error: authError } =
        await this.client.auth.admin.updateUserById(user.id, {
          email: user?.email,
          phone: user?.phone,
          user_metadata: {
            full_name: user?.name,
          },
        });

      if (authError) {
        throw new AuthorizationError(
          `Authorization error: ${authError.message}`
        );
      }

      return { message: "User updated" };
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async deleteUser(userId: string): Promise<any> {
    try {
      const { data: deletedUser, error: deleteError } = await this.client
        .from("users")
        .delete()
        .eq("id", userId);
      if (deleteError) {
        throw new DatabaseError(
          `Error deleting user from public.users: ${deleteError.message}`
        );
      }

      const { data, error } = await this.client.auth.admin.deleteUser(userId);
      if (error) {
        throw new AuthorizationError(
          `Error deleting user from auth.users: ${error.message}`
        );
      }
      return { deletedUser };
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async banUser(userId: string, duration: string): Promise<any> {
    try {
      const { data: user, error } = await this.client.auth.admin.updateUserById(
        userId,
        { ban_duration: duration }
      );

      if (error) {
        throw new AuthorizationError(`Authorization error: ${error.message}`);
      }

      return;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async sendResetPassword(email: string): Promise<any> {
    try {
      const { data, error } =
        await this.client.auth.resetPasswordForEmail(email);

      if (error) {
        throw new AuthorizationError(`Authorization error: ${error.message}`);
      }

      return;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async changeUserPassword(userId: any, password: string): Promise<any> {
    try {
      const { data, error } = await this.client.auth.admin.updateUserById(
        userId,
        {
          password,
        }
      );

      if (error) {
        throw new AuthorizationError(`Authorization error: ${error.message}`);
      }

      return;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async isNicknameUnique(nickname: string): Promise<boolean> {
    try {
      const { data, error } = await this.client
        .from("users")
        .select("id")
        .eq("nickname", nickname)
        .single();

      if (error && error.code !== "PGRST116") {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      return !data; // If no data is returned, the nickname is unique
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  //auth
  async getSession(): Promise<any> {
    try {
      const { data, error } = await this.client.auth.getSession();

      if (error) {
        throw new AuthorizationError(`Authorization error: ${error.message}`);
      }

      if (data.session && data.session.user) {
        const userId = data.session.user.id;

        // Fetch additional user data including role
        const { data: userData, error: userError } = await this.client
          .from("users")
          .select(
            `
            *,
            user_roles!inner (
              role_id,
              roles (
                name,
                access_level
              )
            )
          `
          )
          .eq("id", userId)
          .single();

        if (userError) {
          throw new DatabaseError(`Database error: ${userError.message}`);
        }

        if (userData) {
          const roleName =
            userData.user_roles?.roles?.name || "No role assigned";
          const roleData = userData.user_roles
            ? {
                role_id: userData.user_roles.role_id,
                name: userData.user_roles.roles.name,
                access_level: userData.user_roles.roles.access_level,
              }
            : {
                role_id: null,
                name: "No role assigned",
                access_level: null,
              };

          data.session.user = {
            ...data.session.user,
            ...userData,
            role: roleName,
            role_data: roleData,
          };

          delete data.session.user.user_roles;
        }
      }

      return data;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getCurrentUser(): Promise<any[]> {
    try {
      const {
        data: { user },
        error,
      } = await this.client.auth.getUser();

      if (error) {
        throw new AuthorizationError(`Authorization error: ${error.message}`);
      }

      const additionalFields = await this.getAdditionalUserFields(user.id);

      const provider = user.app_metadata.provider;

      return {
        ...user,
        ...additionalFields,
        provider,
      };
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async verifyOtp(token: string, email: string, type: string): Promise<any> {
    try {
      const { data, error } = await this.client.auth.verifyOtp({
        email,
        token,
        type,
      });

      if (error) {
        throw new AuthorizationError(`Authorization error: ${error.message}`);
      }

      return data;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async inviteByEmail(email: string, userSession: any): Promise<any> {
    try {
      const { data, error } =
        await this.client.auth.admin.inviteUserByEmail(email);

      if (error) {
        throw new AuthorizationError(`Authorization error: ${error.message}`);
      }

      return;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
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
        throw createError({
          statusCode: 500,
          statusMessage: error.message,
        });
      } else {
        throw error;
      }
    }
  }

  //utils
  async assignRole(userId: string, roleId: string, userSession: any) {
    try {
      const userRole = await this.getUserRole(userSession.id);

      // Check if the role exists
      const { data: roleData, error: roleError } = await this.client
        .from("roles")
        .select("id, name, access_level")
        .eq("id", roleId)
        .single();

      if (roleError || !roleData) {
        throw new DatabaseError(
          "Error retrieving role data or invalid role_id"
        );
      }

      // Get the current user's role
      const { data: currentUserData, error: currentUserError } =
        await this.client
          .from("user_roles")
          .select("role_id")
          .eq("user_id", userId)
          .single();

      if (currentUserError && currentUserError.code !== "PGRST116") {
        throw new DatabaseError(`Database error: ${currentUserError.message}`);
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
        throw new AuthorizationError(
          "Admins cannot change the role of other admins or superadmins"
        );
      }

      if (userRole.name !== "superadmin" && roleData.name === "superadmin") {
        throw new AuthorizationError(
          "Only superadmins can assign the superadmin role"
        );
      }

      const { data, error } = await this.client
        .from("user_roles")
        .upsert({
          user_id: userId,
          role_id: roleId,
        })
        .eq("user_id", userId)
        .select();

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      return { response: "User role updated" };
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  private async getRoleName(roleId: number): Promise<string | null> {
    if (!roleId) return null;

    try {
      let { data, error } = await this.client
        .from("roles")
        .select("*")
        .eq("id", roleId)
        .single();

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      return data?.name || "Unknown Role";
    } catch (error: any) {
      console.error("Error fetching role name:", error);
      return "Unknown Role";
    }
  }

  //me
  async getMe(): Promise<any> {
    try {
      const userSession = await this.getCurrentUser();
      return userSession;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async deleteMe(userSession: any): Promise<any> {
    try {
      const { error: deleteError } = await this.client
        .from("users")
        .delete()
        .eq("id", userSession!.id);
      if (deleteError) {
        throw new DatabaseError(
          `Error deleting user data: ${deleteError.message}`
        );
      }

      const { data, error } = await this.client.auth.admin.deleteUser(
        userSession!.id
      );
      if (error) {
        throw new AuthorizationError("Error deleting authentication data");
      }

      return { response: "User account deleted successfully." };
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async updateMe(user: any, data: any): Promise<any> {
    try {
      const { error } = await this.client
        .from("users")
        //@ts-ignore
        .update({
          name: data.name,
          nickname: data.nickname,
        })
        .eq("id", user.id)
        .select();

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      const { data: authUser, error: authError } =
        await this.client.auth.admin.updateUserById(user.id, {
          phone: data?.phone,
          user_metadata: {
            full_name: data?.name,
          },
        });

      if (authError) {
        throw new AuthorizationError(
          `Authorization error: ${authError.message}`
        );
      }

      return { response: "User updated" };
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async putMe(user: any, data: any): Promise<any> {}

  async updateMePhoto(userId: any, photoUrl: any): Promise<any> {
    try {
      const { error: userError } = await this.client
        .from("users")
        .update({ photo: photoUrl })
        .eq("id", userId);

      if (userError) {
        throw new DatabaseError(`Database error: ${userError.message}`);
      }

      return { success: true };
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getMePermissions(userId: string): Promise<any> {
    try {
      let { data: userPermissions, error: userPermissionsError } =
        await this.client
          .from("user_permissions")
          .select("*")
          .eq("user_id", userId);

      if (userPermissionsError) {
        throw new DatabaseError(
          `Database error: ${userPermissionsError.message}`
        );
      }

      const permissionIds = userPermissions.map(
        (perm: any) => perm.permission_id
      );

      let { data: permissions, error: permissionsError } = await this.client
        .from("permissions")
        .select("name, resource, action")
        .in("id", permissionIds);

      if (permissionsError) {
        throw new DatabaseError(`Database error: ${permissionsError.message}`);
      }

      return permissions || [];
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async updatePassword(user: any, password: string): Promise<any> {
    try {
      const { data, error } = await this.client.auth.admin.updateUserById(
        user.id,
        {
          password,
        }
      );

      if (error) {
        throw new AuthorizationError(`Authorization error: ${error.message}`);
      }

      return;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
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
    try {
      const fileBuffer = Buffer.from(file, "base64");

      const { data, error: uploadError } = await this.client.storage
        .from(bucketName)
        .upload(filePath, fileBuffer, {
          upsert,
          contentType,
        });

      if (uploadError) {
        throw new DatabaseError(`Upload error: ${uploadError.message}`);
      }

      const {
        data: { publicUrl },
      } = this.client.storage.from(bucketName).getPublicUrl(filePath);

      return { publicUrl };
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async deleteFile(bucketName: string, filePath: string): Promise<any> {
    try {
      const { error: deleteError } = await this.client.storage
        .from(bucketName)
        .remove([filePath]);

      if (deleteError) {
        throw new DatabaseError(`Delete error: ${deleteError.message}`);
      }

      return { success: true };
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  //permissions
  async getPermissions(userId: string): Promise<any> {
    try {
      let { data: userPermissions, error: userPermissionsError } =
        await this.client
          .from("user_permissions")
          .select("*")
          .eq("user_id", userId);

      if (userPermissionsError) {
        throw new DatabaseError(
          `Database error: ${userPermissionsError.message}`
        );
      }

      const permissionIds = userPermissions.map(
        (perm: any) => perm.permission_id
      );

      let { data: permissions, error: permissionsError } = await this.client
        .from("permissions")
        .select("*")
        .in("id", permissionIds);

      if (permissionsError) {
        throw new DatabaseError(`Database error: ${permissionsError.message}`);
      }

      return permissions;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async updatePermissions(userId: string, permissions: any[]): Promise<any> {
    try {
      // Fetch all available permissions
      const availablePermissions = await this.getAvailablePermissions();

      // Fetch existing user permissions
      const { data: existingUserPermissions, error: fetchError } =
        await this.client
          .from("user_permissions")
          .select("permission_id")
          .eq("user_id", userId);

      if (fetchError) {
        throw new DatabaseError(`Database error: ${fetchError.message}`);
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
          throw new DatabaseError(`Database error: ${removeError.message}`);
        }
      }

      if (permissionsToAdd.length > 0) {
        const { error: addError } = await this.client
          .from("user_permissions")
          .insert(permissionsToAdd);

        if (addError) {
          throw new DatabaseError(`Database error: ${addError.message}`);
        }
      }

      return {
        success: true,
        added: permissionsToAdd.length,
        removed: permissionsToRemove.length,
      };
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getAvailablePermissions(): Promise<any> {
    try {
      let { data: permissions, error: permissionsError } = await this.client
        .from("permissions")
        .select("id, name, resource, action");

      if (permissionsError) {
        throw new DatabaseError(`Database error: ${permissionsError.message}`);
      }

      return permissions;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  //roles
  async getRoles(): Promise<any[]> {
    try {
      const { data, error } = await this.client
        .from("roles")
        .select("*")
        .order("access_level", { ascending: true });

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      return data;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getRolePermissions(roleId: number): Promise<any[]> {
    try {
      const { data, error } = await this.client
        .from("role_permissions")
        .select("permissions(id, name, action, resource)")
        .eq("role_id", roleId);

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      return data.map((item: any) => item.permissions);
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async addRolePermission(roleId: number, permissionId: number): Promise<void> {
    try {
      const { error } = await this.client
        .from("role_permissions")
        .insert({ role_id: roleId, permission_id: permissionId });

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async removeRolePermission(
    roleId: number,
    permissionId: number
  ): Promise<void> {
    try {
      const { error } = await this.client
        .from("role_permissions")
        .delete()
        .eq("role_id", roleId)
        .eq("permission_id", permissionId);

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    try {
      const { data: roleData, error: roleError } = await this.client
        .from("user_roles")
        .select("role_id")
        .eq("user_id", userId)
        .single();

      if (roleError) {
        throw roleError;
      }

      const roleId = roleData.role_id;

      const { data: rolePermissions, error: permissionsError } =
        await this.client
          .from("role_permissions")
          .select("permissions(name)")
          .eq("role_id", roleId);

      if (permissionsError) {
        throw permissionsError;
      }

      const { data: userPermissions, error: userPermissionsError } =
        await this.client
          .from("user_permissions")
          .select("permissions(name)")
          .eq("user_id", userId);

      if (userPermissionsError) {
        throw userPermissionsError;
      }

      const allPermissions = [
        ...rolePermissions.map((rp: any) => rp.permissions.name),
        ...userPermissions.map((up: any) => up.permissions.name),
      ];

      return [...new Set(allPermissions)];
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getUserRole(userId: string): Promise<any> {
    try {
      const { data, error } = await this.client
        .from("user_roles")
        .select("roles(id, name, access_level)")
        .eq("user_id", userId)
        .single();

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      return data.roles;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async updateRole(roleId: number, accessLevel: number): Promise<any> {
    try {
      const { data, error } = await this.client
        .from("roles")
        .update({ access_level: accessLevel })
        .eq("id", roleId);

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }
      return { success: true };
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getRoleById(roleId: number): Promise<any> {
    try {
      const { data, error } = await this.client
        .from("roles")
        .select("*")
        .eq("id", roleId)
        .single();

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      return data;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
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
          throw new DatabaseError("Email already subscribed");
        }
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      return { success: true };
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async deleteNewsletterSubscriber(email: string): Promise<any> {
    try {
      const { data, error } = await this.client
        .from("newsletter_subscribers")
        .delete()
        .eq("email", email);

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      return data;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getNewsletterSubscribers(params: PaginationParams): Promise<any> {
    try {
      const tableName = "newsletter_subscribers";
      const columns = ["id", "email", "created_at"];
      const searchableColumns = ["email"];

      const query = await this.buildQuery(
        params,
        tableName,
        columns,
        searchableColumns
      );

      const { data, error, count } = await query;

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      const { count: totalCount, error: totalCountError } = await this.client
        .from(tableName)
        .select("*", { count: "exact", head: true });

      if (totalCountError) {
        throw new DatabaseError(`Database error: ${totalCountError.message}`);
      }

      return {
        data,
        totalQueryRecords: count,
        totalRecords: totalCount,
      };
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  //analytics
  async getNewSignupsCount(periodStart: string): Promise<number> {
    try {
      const { count, error } = await this.client
        .from("users")
        .select("*", { count: "exact", head: true })
        .gte("created_at", periodStart);

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      return count || 0;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getPreviousNewSignupsCount(
    previousPeriodStart: string,
    currentPeriodStart: string
  ): Promise<number> {
    try {
      const { count, error } = await this.client
        .from("users")
        .select("*", { count: "exact", head: true })
        .gte("created_at", previousPeriodStart)
        .lt("created_at", currentPeriodStart);

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      return count || 0;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getTotalUsersCount(): Promise<number> {
    try {
      const { count, error } = await this.client
        .from("users")
        .select("*", { count: "exact", head: true });

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      return count || 0;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getTotalUsersCountBeforeDate(date: string): Promise<number> {
    try {
      const { count, error } = await this.client
        .from("users")
        .select("*", { count: "exact", head: true })
        .lt("created_at", date);

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      return count || 0;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getPageViewsCount(periodStart: string): Promise<number> {
    try {
      const { count, error } = await this.client
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("created_at", periodStart);

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      return count || 0;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getPreviousPageViewsCount(
    previousPeriodStart: string,
    currentPeriodStart: string
  ): Promise<number> {
    try {
      const { count, error } = await this.client
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("created_at", previousPeriodStart)
        .lt("created_at", currentPeriodStart);

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      return count || 0;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getUniqueVisitorsCount(periodStart: string): Promise<number> {
    try {
      const { data, error } = await this.client
        .from("page_views")
        .select("session_id")
        .gte("created_at", periodStart);

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      const uniqueVisitorsSet = new Set(
        data.map((item: any) => item.session_id)
      );
      return uniqueVisitorsSet.size;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getPreviousUniqueVisitorsCount(
    previousPeriodStart: string,
    currentPeriodStart: string
  ): Promise<number> {
    try {
      const { data, error } = await this.client
        .from("page_views")
        .select("session_id")
        .gte("created_at", previousPeriodStart)
        .lt("created_at", currentPeriodStart);

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      const uniqueVisitorsSet = new Set(
        data.map((item: any) => item.session_id)
      );
      return uniqueVisitorsSet.size;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async insertPageView(pageViewData: {
    session_id: string;
    user_id: string | null;
    page_url: string;
    referrer: string;
    created_at: string;
  }): Promise<void> {
    try {
      const { error } = await this.client
        .from("page_views")
        .insert(pageViewData);

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getNewSignupsCountBetweenDates(
    startDate: string,
    endDate: string
  ): Promise<number> {
    try {
      const { count, error } = await this.client
        .from("users")
        .select("id", { count: "exact", head: true })
        .gte("created_at", startDate)
        .lte("created_at", endDate);

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      return count || 0;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getPageViewsCountBetweenDates(
    startDate: string,
    endDate: string
  ): Promise<number> {
    try {
      const { count, error } = await this.client
        .from("page_views")
        .select("id", { count: "exact", head: true })
        .gte("created_at", startDate)
        .lte("created_at", endDate);

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      return count || 0;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getUniqueVisitorsCountBetweenDates(
    startDate: string,
    endDate: string
  ): Promise<number> {
    try {
      const { data, error } = await this.client
        .from("page_views")
        .select("session_id", { count: "exact" })
        .gte("created_at", startDate)
        .lte("created_at", endDate)
        .not("session_id", "is", null); // Ensure session_id is not null

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      // Use Set to collect unique session IDs
      const uniqueSessions = new Set(data.map((item: any) => item.session_id));

      return uniqueSessions.size;
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  //events
  async saveEvent(
    action: string,
    title: string,
    details: any,
    metadata: EventMetadata
  ): Promise<void> {
    try {
      const { error } = await this.client
        .from("events")
        .insert([{ action, title, details, metadata }]);

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  async getEvents(params: PaginationParams): Promise<any> {
    try {
      const tableName = "events";
      const columns = ["*"];
      const searchableColumns = ["action", "title", "details"];

      const query = await this.buildQuery(
        params,
        tableName,
        columns,
        searchableColumns
      );

      const { data: events, error, count } = await query;

      if (error) {
        throw new DatabaseError(`Database error: ${error.message}`);
      }

      const { count: totalCount, error: totalCountError } = await this.client
        .from(tableName)
        .select("*", { count: "exact", head: true });

      if (totalCountError) {
        throw new DatabaseError(`Database error: ${totalCountError.message}`);
      }

      return {
        data: events,
        totalQueryRecords: count,
        totalRecords: totalCount,
      };
    } catch (error: any) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
  }

  //utils
  async buildQuery(
    params: PaginationParams,
    tableName: string,
    columns: string[],
    searchableColumns: string[]
  ): Promise<any> {
    const offset = parseInt(params.offset?.toString() || "0", 10);
    const limit = parseInt(params.limit?.toString() || "5000", 10);
    const sortField = params.sortField || "created_at";
    const sortOrder = params.sortOrder === "asc";
    const filters: Filters =
      typeof params.filters === "string"
        ? JSON.parse(params.filters)
        : params.filters || {};

    let query = this.client
      .from(tableName)
      .select(columns.join(", "), { count: "exact" });

    if (filters) {
      const filterKeys = Object.keys(filters);
      filterKeys.forEach((key) => {
        if (key !== "global") {
          const column = key;
          const { value, matchMode } = filters[column];

          let filterValue = "";
          switch (matchMode) {
            case "contains":
              filterValue = `%${value}%`;
              break;
            case "startsWith":
              filterValue = `${value}%`;
              break;
            case "endsWith":
              filterValue = `%${value}`;
              break;
            case "equals":
              filterValue = `${value}`;
              break;
            default:
              filterValue = `%${value}%`;
          }

          if (column === "id") {
            // Cast id to text in the filter condition
            query = query.filter(`id::text`, "ilike", filterValue);
          } else {
            query = query.ilike(column, filterValue);
          }
        }
      });

      // Apply global filter
      if (filters.global && filters.global.value) {
        const { value, matchMode } = filters.global;

        let ilikePattern = "";
        switch (matchMode) {
          case "contains":
            ilikePattern = `%${value}%`;
            break;
          case "startsWith":
            ilikePattern = `${value}%`;
            break;
          case "endsWith":
            ilikePattern = `%${value}`;
            break;
          case "equals":
            ilikePattern = `${value}`;
            break;
          default:
            ilikePattern = `%${value}%`;
        }

        // Apply global filter to searchable columns
        const orConditions = searchableColumns
          .map((column) => {
            if (column === "id") {
              // Cast id to text in the condition
              return `id::text.ilike.${ilikePattern}`;
            } else {
              return `${column}.ilike.${ilikePattern}`;
            }
          })
          .join(",");

        query = query.or(orConditions);
      }
    }

    // Apply sorting
    query = query.order(sortField, { ascending: sortOrder });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    return query;
  }
}
