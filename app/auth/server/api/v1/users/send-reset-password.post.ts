import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event, userSession) => {
  const server = await getBackendClient(event, true);
  let body = await readBody(event);

  if (!body.email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing data",
    });
  }

  try {
    const user = await server.sendResetPassword(body.email);
    return user;
  } catch (err: any) {
    throw createError({
      statusCode: err.code || 500,
      statusMessage: err.message || "Error sending reset password",
    });
  }
}, 75);
