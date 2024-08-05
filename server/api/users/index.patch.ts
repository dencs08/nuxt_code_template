import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "../../utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const body = await readBody(event);
  const client = await getBackendClient(event, true);

  if (!body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required data",
    });
  }

  try {
    await client.updateUser(body);
    return { message: "User updated", data: body };
  } catch (err: any) {
    throw createError({
      statusCode: err.code,
      statusMessage: err.message,
    });
  }
}, "admin");
