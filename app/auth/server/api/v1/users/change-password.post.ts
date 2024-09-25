import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";

const changePasswordSchema = z.object({
  id: z.string(),
  password: z.string(),
});

export default defineApiHandler(async (event) => {
  const server = event.context.backendClient;

  // Validate and sanitize the request body
  const body = await validateBody(event, { schema: changePasswordSchema });

  try {
    const user = await server.changeUserPassword(body.id, body.password);
    return user;
  } catch (err: any) {
    throw createError({
      statusCode: err.code || 500,
      statusMessage: err.message || "Error changing password",
    });
  }
});
