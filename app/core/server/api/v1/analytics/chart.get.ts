import { getChart } from "~/core/server/controllers/analyticsController";
import { defineApiHandler } from "~~/server/utils/api-handler";

export default defineApiHandler(async (event) => {
  const response = await getChart(event);
  return response;
});
