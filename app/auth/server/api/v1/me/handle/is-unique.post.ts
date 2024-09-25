import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";

const nicknameSchema = z.object({
  nickname: z.string(),
});

export default defineApiHandler(async (event) => {
  const body = await validateBody(event, { schema: nicknameSchema });
  const { nickname } = body;

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
