import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email(),
});

export default defineApiHandler(async (event) => {
  const client = event.context.backendClient;
  const user = event.context.user;

  const body = await validateBody(event, { schema: emailSchema });

  try {
    if (body.email && body.email !== user.email) {
      if (user.provider != "email") return;
      //no need to implement as moved to the supabase funcionality and hopefuly sidebase auth will also handle it
      return "Email ready to be updated";
    }
    return { error: "Error" };
  } catch (err: any) {
    throw createError({
      statusCode: err.code || 500,
      statusMessage:
        err.message || "An error occurred during the update process",
    });
  }
});
