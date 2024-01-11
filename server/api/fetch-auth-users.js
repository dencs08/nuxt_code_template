import { serverSupabaseServiceRole } from "#supabase/server";
import { serverSupabaseUser } from "#supabase/server";

export default eventHandler(async (event) => {
    const client = serverSupabaseServiceRole(event);
    await checkUserRole(event, client, "admin");

    let { data: authData, error: authError } = await client.auth.admin.listUsers();
    if (authError) {
        throw authError;
    }

    return authData;
});
