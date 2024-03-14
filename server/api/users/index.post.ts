import { serverSupabaseServiceRole } from "#supabase/server";
import { defineWrappedResponseHandler } from '@/server/utils/defaultHandler'
import { User } from '@/utils/types'

export default defineWrappedResponseHandler (async (event) => {
    const client = serverSupabaseServiceRole(event);
    let body = await readBody(event);

    try {
        const { data, error } = await client.auth.admin.createUser({
            email: body.email,
            password: body.password,
            email_confirm: true,
            user_metadata: {
                full_name: body.name,
                avatar_url: body.photo
            }
        })

        if (error) {
            throw createError({ statusCode: 500, statusMessage: 'Error creating user: ' + error.message });
        }

        body = { ...body, id: data.user.id };
        try {
            await assignRole(event, body);
        } catch (err) {
            const { error: removeError } = await client.auth.admin.deleteUser(data.user.id);
            const { data: deletedUser, error: deleteError } = await client
                .from('users')
                .delete()
                .eq('id', data.user.id);

                throw createError({ statusCode: 500, statusMessage: 'Error creating user, deleted redundant data.' });
        }

        const user: User = {
            id: data.user.id,
            name: body.name,
            email: body.email,
            phone: '',
            photo: body.photo,
            role: body.role,
            provider: data.user.app_metadata.provider,
        };

        return user;
    } catch (err: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'An error occurred during the creation process ' + err.message,
        })
    }
}, 'admin');
