import { serverSupabaseServiceRole } from "#supabase/server";
import { defineWrappedResponseHandler } from "../../utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const client = serverSupabaseServiceRole(event);
  let users = [];

  try {
    let { data, error } = await client.from("users").select(`
                *,
                user_roles (
                    role
                )
            `);

    if (!data || data.length === 0)
      throw createError({ statusCode: 404, statusMessage: "No users found" });

    users = await data.map((user) => {
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
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred while fetching the users",
    });
  }
}, "guest");
