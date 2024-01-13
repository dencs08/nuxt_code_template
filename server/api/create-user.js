import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default eventHandler(async (event) => {
    const client = serverSupabaseServiceRole(event);
    const body = await readBody(event);

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

        const { error: roleError } = await client
            .from('user_roles')
            .update({ role: body.role })
            .eq('user_id', data.user.id)

        if (roleError) {
            throw new Error('Error updating the role: ' + error.message);
        }

        return { response: 'User created', data: data.user.id, body: body.role };
    } catch (err) {
        return { error: 'An error occurred during the creation process', response: err.message };
    }
});
