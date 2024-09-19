import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const client = await getBackendClient(event);
  const userSession = await client.getCurrentUser();

  try {
    // const response = await client.confirmEmail(userSession);
    // return { response };
  } catch (err: any) {
    return {
      error: "An error occurred during the confirmation process",
      response: err.message,
    };
  }
}, 0);
