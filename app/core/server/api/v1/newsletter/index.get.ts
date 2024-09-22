import { defineApiHandler } from "~~/server/utils/api-handler";

export default defineApiHandler(async (event) => {
  const client = event.context.backendClient;
  try {
    const response = await client.getNewsletterSubscribers();
    return response;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: (error as Error).message,
    });
  }
});
