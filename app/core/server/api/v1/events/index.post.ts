import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";

const logSchema = z.object({
  action: z.string(),
  details: z.string(),
});

export default defineApiHandler(async (event) => {
  //not implemented using eventsController with funciton for now.
});
