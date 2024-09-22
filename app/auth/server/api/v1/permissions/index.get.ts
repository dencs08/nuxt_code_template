import { defineApiHandler } from "~~/server/utils/api-handler";

export default defineApiHandler(async (event) => {
  const client = event.context.backendClient;
  try {
    const response = await client.getAvailablePermissions();
    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.code,
      message: (error as Error).message,
    });
  }
});
