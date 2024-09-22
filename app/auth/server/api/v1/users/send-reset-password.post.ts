import { defineApiHandler } from "~~/server/utils/api-handler";

export default defineApiHandler(async (event) => {
  const server = event.context.backendClient;

  let body = await readBody(event);
  if (!body.email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing data",
    });
  }

  try {
    const response = await server.sendResetPassword(body.email);
    return response;
  } catch (err: any) {
    throw createError({
      statusCode: err.code || 500,
      statusMessage: err.message || "Error sending reset password",
    });
  }
});
