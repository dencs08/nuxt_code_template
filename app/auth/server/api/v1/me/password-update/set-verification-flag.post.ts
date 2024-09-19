import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event, userSession) => {
  const storage = useStorage();

  if (!userSession) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  await storage.setItem(`user:${userSession.id}:password-reset`, true, {
    ttl: 60 * 60, // 1 hour in seconds
  });

  return { message: "Verification flag set successfully" };
}, 0);
