import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event, userSession) => {
  const storage = useStorage();

  if (!userSession) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
  await storage.setItem(`user:${userSession.id}:first-login`, true, {
    ttl: 60 * 20, // TTL (timetolive) is set to 86400 seconds (24 hours)
  });

  return { message: "Verification flag set successfully" };
}, 0);
