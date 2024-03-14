import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import { defineWrappedResponseHandler } from '@/server/utils/defaultHandler'

export default defineWrappedResponseHandler (async (event) => {
    const client = serverSupabaseServiceRole(event);
    const userSession = await serverSupabaseUser(event)

    try {
        const { data: publicUser, error } = await client
            .from('users')
            .select('*')
            .eq('id', userSession.id)
            .single();

        if (error) {
            throw createError(500, 'Error confirming email');
        }

        if (publicUser.new_email === userSession.new_email && publicUser.new_email != null) {
            const { data, error } = await client
                .from('users')
                .update({
                    email: publicUser.new_email,
                    new_email: null
                })
                .eq('id', userSession.id)

            if (error) {
                throw createError(500, 'Error confirming email');
            }
        }

        //if supabase already changed the email and removed auth.users.new_email 
        if (publicUser.new_email != userSession.new_email && publicUser.new_email === userSession.email) {
            const { data, error } = await client
                .from('users')
                .update({
                    email: publicUser.new_email,
                    new_email: null
                })
                .eq('id', userSession.id)

            if (error) {
                throw createError(500, 'Error confirming email');
            }
        }

        return { response: 'Email confirmation successful' };
    } catch (err) {
        return { error: 'An error occurred during the confirmation process', response: err.message };
    }
}, 'guest');
