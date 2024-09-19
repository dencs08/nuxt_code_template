import { H3Event } from "h3";
import { getRoles } from "~~/server/controllers/rolesController";

export default defineEventHandler(async (event: H3Event) => {
  const response = await getRoles(event);
  return { response };
});
