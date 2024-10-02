import { defineApiHandler } from "~~/server/utils/api-handler";
import type { PaginationParams } from "~~/types/pagination";
export default defineApiHandler(async (event) => {
  const client = event.context.backendClient;
  const params = getQuery(event);
  try {
    const response = await client.getNewsletterSubscribers(
      params as PaginationParams
    );
    return response;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: (error as Error).message,
    });
  }
});
