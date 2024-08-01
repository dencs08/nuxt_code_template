import { defineWrappedResponseHandler } from "../../utils/defaultHandler";
import { getBackendClient } from "../../lib/backend";

export default defineWrappedResponseHandler(async (event) => {
  const client = await getBackendClient();
  const body = await readBody(event);

  try {
    const data = await client.deleteUser(body.id);
    return { response: "User deleted", data: data };
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred during the deletion process",
    });
  }
}, "superadmin");
