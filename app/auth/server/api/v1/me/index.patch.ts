import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";

const meSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  nickname: z.string().optional(),
  phone: z.string().optional(),
});

export default defineApiHandler(async (event) => {
  const client = event.context.backendClient;
  const user = event.context.user;

  const body = await validateBody(event, { schema: meSchema });

  try {
    const response = await client.updateMe(user, body);
    return response;
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "An error occurred during the deletion process " + err.message,
    });
  }
});
