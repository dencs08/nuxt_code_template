import type { H3Event } from "h3";
import { getUsers, getUsersByIds } from "~~/server/controllers/usersController";

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);

  if (query.userIds) {
    const response = await getUsersByIds(event);
    return response;
  }

  const response = await getUsers(event);
  return response;
});
