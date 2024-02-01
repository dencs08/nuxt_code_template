import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default eventHandler(async (event) => {
    const client = serverSupabaseServiceRole(event);
    const body = await readBody(event);

    await checkUserRole(event, client, 'superadmin');

    try {
        const { data, error } = await client.auth.admin.deleteUser(body.userId);
        if (error) {
            throw new Error('Error deleting user data: ' + error.message);
        }

        const { data: deletedUser, error: deleteError } = await client
            .from('users')
            .delete()
            .eq('id', body.userId);
        if (deleteError) {
            throw new Error('Error deleting user from public.users: ' + deleteError.message);
        }

        return { response: 'User deleted', data: deletedUser };
    } catch (err) {
        return { error: 'An error occurred during the deletion process', response: err.message };
    }
});
