import { getMailRender } from "~/core/server/controllers/mailController";
import { readBody } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const response = await getMailRender(body.mjmlContent);
  return response.html;
});
