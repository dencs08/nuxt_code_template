import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default eventHandler(async (event) => {
    const client = serverSupabaseServiceRole(event);
    const body = await readBody(event);

    await checkUserRole(event, client, 'admin');

    if (!body.id) {
        throw new Error('Missing data for update');
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
            throw new Error('Error updating user data');
        }
        return { response: 'User updated' };
    } catch (err) {
        throw new Error('An error occurred during the update process');
    }
});
