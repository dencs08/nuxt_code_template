import { z } from "zod";
import { defineApiHandler } from "~~/server/utils/api-handler";

const subscriptionSchema = z.object({
  email: z.string().email(),
});

export default defineApiHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.email) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required data",
      });
    }

    const { email } = subscriptionSchema.parse(body);
    const client = event.context.backendClient;
    const response = await client.addNewsletterSubscriber(email);
    return response;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid email format",
      });
    }

    // Handle specific error codes from addNewsletterSubscriber
    if (error.statusCode === 409) {
      throw createError({
        statusCode: 409,
        statusMessage: "Email already subscribed",
      });
    }

    // For any other error, return a 500 Internal Server Error
    console.error("Newsletter subscription error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "An unexpected error occurred",
    });
  }
});