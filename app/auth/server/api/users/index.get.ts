import { getBackendClient } from "../../../../../lib/backend";
import { defineWrappedResponseHandler } from "../../../../../server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const client = await getBackendClient(event, true);
  let users = [];

  try {
    users = await client.getUsers();
    return users;
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred while fetching the users",
    });
  }
}, 10);
