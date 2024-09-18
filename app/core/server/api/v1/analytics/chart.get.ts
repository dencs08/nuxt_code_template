import { defineEventHandler } from "h3";
import { getChart } from "~/core/server/controllers/analyticsController";

export default defineEventHandler(async (event) => {
  const response = await getChart(event);
  return response;
});
