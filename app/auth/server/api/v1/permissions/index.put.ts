import { defineApiHandler } from "~~/server/utils/api-handler";
const supportedActions = ["read", "write", "delete"];

export default defineApiHandler(async (event) => {
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

  const client = event.context.backendClient;
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
});
