import { readBody } from "h3";
import { defineApiHandler } from "~~/server/utils/api-handler";

export default defineApiHandler(async (event) => {
  try {
    // Read the request body
    const body = await readBody(event);

    const { session_id, page_url, referrer, timestamp } = body;

    if (!session_id || !page_url || !timestamp) {
      event.node.res.statusCode = 400;
      return { error: "Missing required fields" };
    }

    const backendClient = event.context.backendClient;

    // Optionally, get the user session
    const session = event.context.userSession;

    const user_id = session?.user?.id || null;

    await backendClient.insertPageView({
      session_id,
      user_id,
      page_url,
      referrer,
      created_at: timestamp,
    });

    return;
  } catch (error) {
    console.error("Error logging page view:", error);
    event.node.res.statusCode = 500;
    return { error: "Internal Server Error" };
  }
});
