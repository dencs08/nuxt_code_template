import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

export default defineApiHandler(async (event) => {
  const server = event.context.backendClient;

  const body = await validateBody(event, { schema: resetPasswordSchema });

  try {
    const response = await server.sendResetPassword(body.email);
    return response;
  } catch (err: any) {
    throw createError({
      statusCode: err.code || 500,
      statusMessage: err.message || "Error sending reset password",
    });
  }
});
