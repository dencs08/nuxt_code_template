import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    let users = [];

    await checkUserRole(event, client, "user"); //ensure user has a role of "user" and supabase RLS manages access to the users table

    let { data, error } = await client
        .from('users')
        .select(`
            *,
            user_roles (
                role
            )
        `);

    users = await data.map(user => {
        const newUser = {
            ...user,
            role: user.user_roles ? user.user_roles.role : 'No role assigned',
        };
        delete newUser.user_roles;
        return newUser;
    });

    if (error) {
        throw error;
    }

    return users;
});
