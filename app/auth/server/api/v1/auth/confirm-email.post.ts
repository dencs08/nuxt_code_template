import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";

const confirmEmailSchema = z.object({
  token: z.string(),
});

export default defineApiHandler(async (event) => {
  const client = event.context.backendClient;

  const body = await validateBody(event, { schema: confirmEmailSchema });

  try {
    const response = await client.confirmEmail(body.token);
    return { response };
  } catch (err: any) {
    return {
      error: "An error occurred during the confirmation process",
      response: err.message,
    };
  }
});
