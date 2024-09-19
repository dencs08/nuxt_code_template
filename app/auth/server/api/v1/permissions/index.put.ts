import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";

const supportedActions = ["read", "write", "delete"];

export default defineWrappedResponseHandler(async (event) => {
  const body = await readBody(event);

  if (!body.userId || !body.permissions) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required data",
    });
  }

  for (const permission of body.permissions) {
    for (const action in permission.action) {
      if (!supportedActions.includes(action)) {
        throw createError({
          statusCode: 400,
          statusMessage: `Unsupported action: ${action}`,
        });
      }
    }
  }

  const client = await getBackendClient(event, true);
  try {
    const response = await client.updatePermissions(
      body.userId,
      body.permissions
    );
    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.code,
      message: error.message,
    });
  }
}, 75);
