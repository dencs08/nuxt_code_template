import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import { defineWrappedResponseHandler } from '@/server/utils/defaultHandler'

export default defineWrappedResponseHandler (async (event) => {
    const body = await readBody(event);

    if (!body.role || !body.id) {
        throw createError(400, 'Missing required data');
    }

    await assignRole(event, body);
}, 'admin');
