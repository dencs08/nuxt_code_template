import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";
//TODO check if this works
export default defineWrappedResponseHandler(async (event) => {
  const client = await getBackendClient(event);
  const user = await client.getCurrentUser();
  const body = await readBody(event);

  try {
    if (body.email && body.email !== user.email) {
      if (user.provider != "email") return;
      const response = await client.updateMeEmail(user, body);
    }
    return { response: "Verification link sent" };
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "An error occurred during the deletion process " + err.message,
    });
  }
}, 0);
