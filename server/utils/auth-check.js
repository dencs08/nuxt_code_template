import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import { validRoles } from "@/utils/roles";

export async function getUserSession(event) {
    const userSession = await serverSupabaseUser(event);

    if (!userSession) {
        throw new Error('No active session found. User must be logged in.');
    }
    if (!userSession.id || !userSession.email) {
        throw new Error('Invalid session data.');
    }

    return userSession;
}

// Usage
// checkUserRole(event, client, 'admin');
export async function checkUserRole(event, client, role) {
    const user = await getUserSession(event);

    const { data: userRoles, error } = await client
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

    if (error) {
        throw new Error(`Error retrieving user roles: ${error.message}`);
    }

    const userRoleLevel = validRoles.find(validRole => validRole.value === userRoles.role)?.level;
    const requiredRoleLevel = validRoles.find(validRole => validRole.value === role)?.level;

    if (!userRoleLevel || !requiredRoleLevel || userRoleLevel < requiredRoleLevel) {
        throw new Error(`Unauthorized: User is not a ${role} or higher`);
    }
}

// Usage
// await getUserRole(event, client);
export async function getUserRole(event, client) {
    const user = await getUserSession(event);

    const { data, error } = await client
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

    if (error) {
        throw new Error(`Error retrieving user roles: ${error.message}`);
    }

    return data.role;
}