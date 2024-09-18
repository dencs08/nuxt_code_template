import { defineEventHandler } from "h3";
import { getMetrics } from "~/core/server/controllers/analyticsController";
export default defineEventHandler(async (event) => {
  const response = await getMetrics(event);
  return response;
});
