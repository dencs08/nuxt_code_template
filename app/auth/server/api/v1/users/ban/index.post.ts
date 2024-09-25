import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";

const banSchema = z.object({
  id: z.string(),
  duration: z.string(),
});

export default defineApiHandler(async (event) => {
  const server = event.context.backendClient;

  const body = await validateBody(event, { schema: banSchema });

  const user = await server.banUser(body.id, body.duration);
  return user;
});
