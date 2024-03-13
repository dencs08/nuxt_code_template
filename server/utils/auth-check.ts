import { serverSupabaseServiceRole, serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import { validRoles } from "@/utils/roles";
import { create } from "domain";

export async function getUserSession(event: any) {
    const userSession = await serverSupabaseUser(event);

    if (!userSession) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized: No active session found. User must be logged in.' });
    }
    if (!userSession.id || !userSession.email) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized: No active session found. User must be logged in.' })
    }

    return userSession;
}

// Usage
// checkUserRole(event, 'admin');
export async function checkUserRole(event: any, role: string) {
    const client = serverSupabaseServiceRole(event);
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
        throw createError({ statusCode: 403, statusMessage: `Unauthorized: User is not a ${role} or higher` });
    }
}

// Usage
// await getUserRole(event);
export async function getUserRole(event: any) {
    const client = serverSupabaseServiceRole(event);
    const user = await getUserSession(event);

    const { data, error } = await client
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

    if (error) {
        throw createError({ statusCode: 500, statusMessage: `Error retrieving user roles: ${error.message}` });
    }

    return data.role;
}