import { getMetrics } from "~/core/server/controllers/analyticsController";
import { defineApiHandler } from "~~/server/utils/api-handler";

export default defineApiHandler(async (event) => {
  const response = await getMetrics(event);
  return response;
});
