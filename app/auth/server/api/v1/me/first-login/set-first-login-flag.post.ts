import { defineApiHandler } from "~~/server/utils/api-handler";

export default defineApiHandler(async (event) => {
  const storage = useStorage();
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
  await storage.setItem(`user:${user.id}:first-login`, true, {
    ttl: 60 * 20, // TTL (timetolive) is set to 86400 seconds (24 hours)
  });

  return { message: "Verification flag set successfully" };
});
