import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";

const permissionsSchema = z.object({
  userId: z.string(),
});

export default defineApiHandler(async (event) => {
  const body = await validateBody(event, { schema: permissionsSchema });

  const client = event.context.backendClient;
  try {
    const response = await client.getPermissions(body.userId);
    return response;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: (error as Error).message,
    });
  }
});
