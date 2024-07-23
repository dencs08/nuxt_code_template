import { serverSupabaseServiceRole } from "#supabase/server";
import { defineWrappedResponseHandler } from "../../utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const client = serverSupabaseServiceRole(event);

  let { data: authData, error: authError } =
    await client.auth.admin.listUsers();
  if (authError) {
    throw authError;
  }

  return authData;
}, "admin");
