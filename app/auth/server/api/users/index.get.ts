import { getBackendClient } from "../../../../../lib/backend";
import { defineWrappedResponseHandler } from "../../../../../server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const client = await getBackendClient(event, true);

  try {
    // users = await client.getUsers();
    // return users;
    const authData = (await client.getAuthUsers()) as any;

    const authUsers: any[] = (authData.users as any[]).map((user) => ({
      id: user.id,
      email: user.email,
    }));

    const profileData = await client.getUsers();

    const combinedData: any[] = (profileData as any[]).map((profile) => {
      const authUser = authUsers.find((user) => user.id === profile.id);
      return {
        ...profile,
        email: authUser ? authUser.email : null,
      };
    });

    return combinedData;
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred while fetching the users",
    });
  }
}, 10);
