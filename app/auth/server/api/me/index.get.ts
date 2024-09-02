import { defineWrappedResponseHandler } from "../../../../../app/core/server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event, userSession) => {
  try {
    return { response: "Account fetched", account: userSession };
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "An error occurred during the fetching process " + err.message,
    });
  }
}, 0);
