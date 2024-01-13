import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import { validRoles } from '@/utils/roles';

export default eventHandler(async (event) => {
    const client = serverSupabaseServiceRole(event);
    const body = await readBody(event);

    await checkUserRole(event, client, 'admin');

    if (!validRoles.map(role => role.value).includes(body.role)) {
        throw new Error('Invalid role', role);
    }

    try {
        const { data, error } = await client
            .from('user_roles')
            .upsert({
                user_id: body.id,
                role: body.role,
            })
            .eq('user_id', body.id) // Make sure to update only the passed body.id
            .select();

        if (error) {
            throw new Error('Error updating user role');
        }
        return { response: 'User role updated' };
    } catch (err) {
        return { error: 'An error occurred during the update process', response: error };
    }
});