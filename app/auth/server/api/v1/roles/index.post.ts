import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";

const roleSchema = z.object({
  roleId: z.number(),
  access_level: z.number(),
});

export default defineApiHandler(async (event) => {
  const body = await validateBody(event, { schema: roleSchema });
  const client = event.context.backendClient;

  try {
    const response = await client.updateRole(body.roleId, body.access_level);
    return response;
  } catch (err: any) {
    throw createError({
      statusCode: err.code,
      statusMessage: err.message,
    });
  }
});
