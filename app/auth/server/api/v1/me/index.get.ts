import { defineApiHandler } from "~~/server/utils/api-handler";
export default defineApiHandler(async (event) => {
  try {
    const user = event.context.user;
    return user;
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "An error occurred during the fetching process " + err.message,
    });
  }
});
