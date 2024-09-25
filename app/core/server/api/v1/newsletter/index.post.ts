import { defineApiHandler } from "~~/server/utils/api-handler";
import type { BackendClient } from "~~/types/backend";
import { validateBody } from "~~/utils/validate";
import { emailSchema } from "~~/utils/schemas";

export default defineApiHandler(async (event) => {
  const { email } = await validateBody(event, {
    schema: emailSchema,
  });

  const client = event.context.backendClient as BackendClient;
  const response = await client.addNewsletterSubscriber(email);
  return response;
});
