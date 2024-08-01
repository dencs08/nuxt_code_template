import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "../../utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const body = await readBody(event);
  const client = await getBackendClient();

  if (!body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required data",
    });
  }

  try {
    await client.updateUser(body);
    return { response: "User updated" };
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred during the update process",
    });
  }
}, "admin");
