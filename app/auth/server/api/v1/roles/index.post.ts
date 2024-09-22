import { defineApiHandler } from "~~/server/utils/api-handler";
export default defineApiHandler(async (event) => {
  const body = await readBody(event);
  const client = event.context.backendClient;

  if (!body.roleId || !body.access_level) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required data",
    });
  }
  try {
    const response = await client.updateRole(body.roleId, body.access_level);
    return response;
  } catch (err: any) {
    throw createError({
      statusCode: err.code,
      statusMessage: err.message,
    });
  }
});
