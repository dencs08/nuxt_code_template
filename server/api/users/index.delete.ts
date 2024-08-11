import { defineWrappedResponseHandler } from "../../utils/defaultHandler";
import { getBackendClient } from "../../../lib/backend";

export default defineWrappedResponseHandler(async (event) => {
  const client = await getBackendClient(event, true);
  const body = await readBody(event);

  try {
    const data = await client.deleteUser(body.userId);
    return { response: "User deleted", data: data };
  } catch (err: any) {
    throw createError({
      statusCode: err.code || 500,
      statusMessage: err.message,
    });
  }
}, 100);
