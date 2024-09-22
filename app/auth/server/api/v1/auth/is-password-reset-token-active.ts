import { defineApiHandler } from "~~/server/utils/api-handler";

export default defineApiHandler(async (event) => {
  const storage = useStorage();
  try {
    const user = event.context.user;
    const isActive = await storage.getItem(`user:${user.id}:password-reset`);
    if (!user || !isActive) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }
    return { exists: true };
  } catch (err: any) {
    return {
      error: "An error occurred",
      response: err.message,
    };
  }
});
