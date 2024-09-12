import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event, userSession) => {
  const storage = useStorage();
  try {
    const isActive = await storage.getItem(
      `user:${userSession.id}:password-reset`
    );
    if (!userSession || !isActive) {
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
}, 0);
