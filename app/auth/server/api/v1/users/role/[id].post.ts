import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";

const roleAssignSchema = z.object({
  id: z.string(),
  role_id: z.number(),
});

export default defineApiHandler(async (event) => {
  const client = event.context.backendClient;
  const user = event.context.user;
  const { id } = event.context.params as { id: string };

  const body = await validateBody(event, { schema: roleAssignSchema });

  if (id !== body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID mismatch",
    });
  }

  const response = await client.assignRole(body.id, body.role_id, user);
  return response;
});
