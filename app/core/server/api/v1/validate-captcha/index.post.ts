import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";

const captchaSchema = z.object({
  token: z.string(),
});

export default defineApiHandler(async (event) => {
  const body = await validateBody(event, { schema: captchaSchema });

  if (!body.token) {
    throw createError({
      statusCode: 422,
      statusMessage: "Token not provided.",
    });
  }

  return await verifyTurnstileToken(body.token);
});
