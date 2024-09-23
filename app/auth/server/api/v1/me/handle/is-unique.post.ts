import { defineApiHandler } from "~~/server/utils/api-handler";

export default defineApiHandler(async (event) => {
  const body = await readBody(event);
  const { nickname } = body;

  if (!nickname) {
    throw createError({
      statusCode: 400,
      statusMessage: "Nickname is required",
    });
  }

  const backendClient = event.context.backendClient;

  try {
    const isUnique = await backendClient.isNicknameUnique(nickname);
    return { isUnique };
  } catch (error: any) {
    console.error("Error checking nickname uniqueness:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error checking nickname uniqueness",
    });
  }
});
