import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().email(),
});

export default defineApiHandler(async (event) => {
  const server = event.context.backendClient;
  const user = event.context.user;

  const body = await validateBody(event, { schema: inviteSchema });

  const invitedUser = await server.inviteByEmail(body.email, user);
  return invitedUser;
});
