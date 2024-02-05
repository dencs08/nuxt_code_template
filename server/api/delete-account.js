import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default eventHandler(async (event) => {
    const client = serverSupabaseServiceRole(event);
    const userSession = await serverSupabaseUser(event)

    await checkUserRole(event, client, 'user');

    try {
        const { data, error } = await client.auth.admin.deleteUser(userSession.id)

        const { data: deletedUser, error: deleteError } = await client
            .from('users')
            .delete()
            .eq('id', userSession.id);
        if (deleteError) {
            throw new Error('Error deleting user from public.users: ' + deleteError.message);
        }

        return { response: 'User deleted', deletedUser: deletedUser, deletedAuth: data };
    } catch (err) {
        throw new Error('An error occurred during the deletion process ' + err.message);
    }
});
