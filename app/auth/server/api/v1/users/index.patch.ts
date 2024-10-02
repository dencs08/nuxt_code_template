import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";
import { saveEvent } from "~~/app/core/server/controllers/eventsController";
const userUpdateSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  nickname: z.string().optional(),
});

export default defineApiHandler(async (event) => {
  const body = await validateBody(event, { schema: userUpdateSchema });
  const client = event.context.backendClient;

  if (!body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required data",
    });
  }

  try {
    await client.updateUser(body);
    await saveEvent(event, {
      action: "UPDATE",
      title: "User updated",
      details: `has updated`,
      metadata: {
        action_by: event.context.user.id,
        action_on: body.id,
      },
    });
    return body;
  } catch (err: any) {
    throw createError({
      statusCode: err.code,
      statusMessage: err.message,
    });
  }
});
