import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import { validRoles } from '@/utils/roles';

export default eventHandler(async (event) => {
    const client = serverSupabaseServiceRole(event);
    const body = await readBody(event);

    await checkUserRole(event, client, 'admin');

    if (!body.role || !body.id) {
        throw new Error('Missing required data');
    }

    await assignRole(event, body);
});