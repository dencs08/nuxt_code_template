import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default eventHandler(async (event) => {
    const client = serverSupabaseServiceRole(event);
    // const body = await readBody(event);
    const userSession = await serverSupabaseUser(event);

    //Check if requested id is == to a user session.
    // if (body.id != userSession.id) throw new Error('Error while checking the indentity. ' + body.id + " != " + userSession.id);

    try {
        const { data, error } = await client
            .from('users')
            .upsert({
                id: userSession.id,
                name: userSession.user_metadata.full_name,
                email: userSession.email,
                phone: userSession.phone,
                photo: userSession.user_metadata.avatar_url,
                last_signin: userSession.last_sign_in_at
            })
            .eq('id', userSession.id) // Make sure to update only the logged-in user's data
            .select();

        if (error) {
            throw new Error('Error updating user data');
        }
        return { response: 'User updated' };
    } catch (err) {
        return { error: 'An error occurred during the update process' };
    }
});
