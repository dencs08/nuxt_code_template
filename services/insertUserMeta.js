export function userService() {
    const client = useSupabaseClient();

    async function upsertUserMeta() {
        const user = useSupabaseUser();
        const userId = user.value.id;

        await client.rpc('upsert_user_data', {
            p_id: userId,
            p_email: user.value.email,
            p_phone: user.value.phone,
            p_first_name: user.value.identities[0].identity_data.full_name.split(' ')[0],
            p_last_name: user.value.identities[0].identity_data.full_name.split(' ')[1],
            p_photo: user.value.user_metadata.avatar_url
        });

        // if (error) {
        //     console.error('Error updating user:', error);
        // } else {
        //     console.log('User updated successfully!');
        // }
    }

    return {
        upsertUserMeta
    };
}
