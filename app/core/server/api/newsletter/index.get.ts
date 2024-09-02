import { getBackendClient } from "../../../../../lib/backend";
import { defineWrappedResponseHandler } from "../../../../../server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const client = await getBackendClient(event, true);
  try {
    const response = await client.getNewsletterSubscribers();
    return response;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: (error as Error).message,
    });
  }
}, 100);
