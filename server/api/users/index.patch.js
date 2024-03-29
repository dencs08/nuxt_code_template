import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import { defineWrappedResponseHandler } from '@/server/utils/defaultHandler'

export default defineWrappedResponseHandler (async (event) => {
    const client = serverSupabaseServiceRole(event);
    const body = await readBody(event);

    if (!body.id) {
        throw createError({statusCode: 400, statusMessage: 'Missing required data'});
    }

    try {
        const { data, error } = await client
            .from('users')
            .upsert({
                id: body.id,
                name: body?.name,
                email: body?.email,
                phone: body?.phone,
                // name: userSession.user_metadata.full_name,
                // email: userSession.email,
                // phone: userSession.phone,
                // photo: userSession.user_metadata.avatar_url,
                // last_signin: userSession.last_sign_in_at
            })
            .eq('id', body.id) // Make sure to update only the passed body.id
            .select();

        if (error) {
            throw createError({statusCode: 500, statusMessage: 'Error updating user data'});
        }
        return { response: 'User updated' };
    } catch (err) {
        throw createError({ statusCode: 500, statusMessage: 'An error occurred during the update process' });
    }
}, 'admin');
