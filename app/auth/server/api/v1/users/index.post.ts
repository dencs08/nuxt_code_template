import { defineApiHandler } from "~~/server/utils/api-handler";

export default defineApiHandler(async (event) => {
  const server = event.context.backendClient;
  const currentUser = event.context.user;
  let body = await readBody(event);

  const user = await server.createUser(body, event, currentUser);
  return user;
});
