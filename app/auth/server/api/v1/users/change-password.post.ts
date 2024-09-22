import { getBackendClient } from "~~/lib/backend";

export default defineApiHandler(async (event) => {
  const server = event.context.backendClient;
  let body = await readBody(event);

  if (!body.password || !body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing data",
    });
  }

  try {
    const user = await server.changeUserPassword(body.id, body.password);
    return user;
  } catch (err: any) {
    throw createError({
      statusCode: err.code || 500,
      statusMessage: err.message || "Error sending reset password",
    });
  }
});
