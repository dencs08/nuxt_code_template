import { serverSupabaseServiceRole } from "#supabase/server";
import { serverSupabaseUser } from "#supabase/server";

//TODO ENSURE THIS ROUTE IS ONLY ACCESSIBLE BY ADMINS BECUASE IT CAN LEAK FUTURE USERS DATA IF NOT PROTECTED.
export default eventHandler(async (event) => {
    const client = serverSupabaseServiceRole(event);
    const user = serverSupabaseUser(event);

    let { data: authData, error: authError } = await client.auth.admin.listUsers();
    if (authError) {
        throw authError;
    }

    return { sensitiveData: authData, user: user };
});
