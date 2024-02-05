import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default eventHandler(async (event) => {
    const client = serverSupabaseServiceRole(event);
    let body = await readBody(event);
    await checkUserRole(event, client, 'admin');

    try {
        const { data, error } = await client.auth.admin.createUser({
            email: body.email,
            password: body.password,
            email_confirm: true,
            user_metadata: {
                full_name: body.name,
                avatar_url: body.photo
            }
        })

        if (error) {
            throw new Error('Error creating user: ' + error.message);
        }

        body = { ...body, id: data.user.id };
        try {
            await assignRole(event, body);
        } catch (err) {
            const { error: removeError } = await client.auth.admin.deleteUser(data.user.id);
            const { data: deletedUser, error: deleteError } = await client
                .from('users')
                .delete()
                .eq('id', data.user.id);
        }

        return { response: 'User created', data: data };
    } catch (err) {
        throw new Error('An error occurred during the creation process ' + err.message);
    }
});
