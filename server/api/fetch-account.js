import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default eventHandler(async (event) => {
    const client = serverSupabaseServiceRole(event);
    const userSession = await serverSupabaseUser(event)

    await checkUserRole(event, client, 'user');

    try {

        return { response: 'Account fetched', account: userSession };
    } catch (err) {
        throw new Error('An error occurred during the fetching process ' + err.message);
    }
});
