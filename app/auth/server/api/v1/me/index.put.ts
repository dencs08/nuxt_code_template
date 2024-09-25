import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";

const mePutSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export default defineApiHandler(async (event) => {
  const client = event.context.backendClient;
  const user = event.context.user;

  // Validate and sanitize the request body
  const body = await validateBody(event, { schema: mePutSchema });

  try {
    const response = await client.putMe(user, body);
    return response;
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred during the put process " + err.message,
    });
  }
});
