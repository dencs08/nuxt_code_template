import { defineEventHandler, H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const client = event.context.backendClient;
  try {
    const response = await client.getNewsletterSubscribers();
    return { response };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: (error as Error).message,
    });
  }
});
