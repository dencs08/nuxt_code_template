import { type UserAuthPublicSession } from "~~/types/user";

export default defineApiHandler(async (event) => {
  const server = event.context.backendClient;
  const user = event.context.user;
  let body = await readBody(event);

  const invitedUser = await server.inviteByEmail(body.email, user);
  return invitedUser;
});
