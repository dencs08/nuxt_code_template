import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import { validRoles } from "@/utils/roles";

export async function assignRole(event, body) {
    const client = serverSupabaseServiceRole(event);
    await checkUserRole(event, client, 'admin');

    const userRole = await getUserRole(event, client);

    if (!validRoles.map(role => role.value).includes(body.role)) {
        throw new Error('Invalid or missing data', role);
    }

    const { data: currentUserData, error: currentUserError } = await client
        .from('user_roles')
        .select('role')
        .eq('user_id', body.id)
        .single();
    if (currentUserError) {
        throw new Error('Error retrieving current user role');
    }

    if (userRole === 'admin' && (currentUserData.role === 'admin' || currentUserData.role === 'superadmin')) {
        throw new Error('Admins cannot change the role of other admins or superadmins');
    }

    if (userRole !== 'superadmin' && body.role === 'superadmin') {
        throw new Error('Only superadmins can assign the superadmin role');
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
        throw new Error('An error occurred during the update process');
    }
}