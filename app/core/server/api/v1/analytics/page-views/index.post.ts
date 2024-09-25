import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";

const pageViewSchema = z.object({
  session_id: z.string(),
  page_url: z.string(),
  referrer: z.string().optional(),
  timestamp: z.string(),
});

export default defineApiHandler(async (event) => {
  try {
    const body = await validateBody(event, { schema: pageViewSchema });

    const { session_id, page_url, referrer, timestamp } = body;

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
