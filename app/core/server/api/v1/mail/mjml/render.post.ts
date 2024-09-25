import { getMailRender } from "~/core/server/controllers/mailController";
import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";

import { z } from "zod";
export default defineApiHandler(async (event) => {
  const { mjmlContent } = await validateBody(event, {
    schema: z.object({
      mjmlContent: z.string(),
    }),
    skipFields: ["mjmlContent"],
  });

  const response = await getMailRender(mjmlContent);
  return response.html;
});
