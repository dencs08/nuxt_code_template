import { getMailRender } from "~/core/server/controllers/mailController";
import { defineApiHandler } from "~~/server/utils/api-handler";
import { readBody } from "h3";

export default defineApiHandler(async (event) => {
  const body = await readBody(event);

  const response = await getMailRender(body.mjmlContent);
  return response.html;
});
