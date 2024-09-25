import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";

const photoSchema = z.object({
  photoUrl: z.string().url(),
});

export default defineApiHandler(async (event) => {
  const body = await validateBody(event, { schema: photoSchema });
  const user = event.context.user;

  try {
    const client = event.context.backendClient;
    const response = await client.updateMePhoto(user.id, body.photoUrl);
    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.code || 500,
      statusMessage: error.statusMessage,
    });
  }
});
