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

  await storage.setItem(`user:${user.id}:password-reset`, true, {
    ttl: 60 * 60, // 1 hour in seconds
  });

  return { message: "Verification flag set successfully" };
});
