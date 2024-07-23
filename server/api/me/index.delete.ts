import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";
import { defineWrappedResponseHandler } from "../../utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const client = serverSupabaseServiceRole(event);
  const userSession = await serverSupabaseUser(event);

  try {
    const { data, error } = await client.auth.admin.deleteUser(userSession!.id);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error deleting authentication data",
      });
    }

    const { error: deleteError } = await client
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
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "An error occurred during the deletion process " + err.message,
    });
  }
}, "guest");
