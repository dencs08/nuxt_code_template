import { defineWrappedResponseHandler } from "../../utils/defaultHandler";
import { getBackendClient } from "../../../lib/backend";

export default defineWrappedResponseHandler(async (event) => {
  const body = await readBody(event);

  if (!body.userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required data",
    });
  }

  const client = await getBackendClient(event, true);
  try {
    const response = await client.getPermissions(body.userId);
    return response;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: (error as Error).message,
    });
  }
}, "admin");
