import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";

const supportedActions = ["read", "write", "delete"];

const permissionsPutSchema = z.object({
  userId: z.string(),
  permissions: z.array(
    z.object({
      action: z.enum(supportedActions as [string, ...string[]]),
      resource: z.string(),
    })
  ),
});

export default defineApiHandler(async (event) => {
  const body = await validateBody(event, { schema: permissionsPutSchema });

  const client = event.context.backendClient;
  try {
    const response = await client.updatePermissions(
      body.userId,
      body.permissions
    );
    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.code,
      message: error.message,
    });
  }
});
