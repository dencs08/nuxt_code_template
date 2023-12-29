import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default eventHandler(async (event) => {
    const client = serverSupabaseServiceRole(event);
    // const body = await readBody(event);
    const userSession = await serverSupabaseUser(event);

    try {
        const { data, error } = await client.auth.admin.deleteUser(userId)

        if (error) {
            throw new Error('Error deleting user data');
        }
        return { response: 'User updated' };
    } catch (err) {
        return { error: 'An error occurred during the deletion process' };
    }
});
