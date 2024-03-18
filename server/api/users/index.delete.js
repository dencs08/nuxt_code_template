import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import { defineWrappedResponseHandler } from '@/server/utils/defaultHandler'

export default defineWrappedResponseHandler (async (event) => {
    const client = serverSupabaseServiceRole(event);
    const body = await readBody(event);

    try {
        const { data, error } = await client.auth.admin.deleteUser(body.userId);
        if (error) {
            throw createError({statusCode: 500, statusMessage: 'Error deleting user from auth.users'});
        }

        const { data: deletedUser, error: deleteError } = await client
            .from('users')
            .delete()
            .eq('id', body.userId);
        if (deleteError) {
            throw createError(500, 'Error deleting user from public.users');
        }

        return { response: 'User deleted', data: deletedUser };
    } catch (err) {
        throw createError({ statusCode: 500, statusMessage: 'An error occurred during the deletion process' });
    }
}, 'superadmin');
