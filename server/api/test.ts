import {
  serverSupabaseClient,
  serverSupabaseServiceRole,
} from "#supabase/server";
import { getBackendClient } from "../../lib/backend";
import { checkUserRole } from "../utils/auth-check";

export default defineEventHandler(async (event) => {
  // const client = await serverSupabaseServiceRole(event);
  // const server = await getBackendClient(event, true);
  const client = await getBackendClient(event);
  try {
    // let users = await client.from("users").select("*");
    const userSession = await client.getCurrentUser();
    // await checkUserRole(userSession, 100);
    let users = await client.getUsers();
    return { userSession, users };
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode,
      statusMessage: err.message,
    });
  }
});
