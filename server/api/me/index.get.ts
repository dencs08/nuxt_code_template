import { getBackendClient } from "../../../lib/backend";
import { defineWrappedResponseHandler } from "../../utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const client = await getBackendClient(event);
  const userSession = await client.getCurrentUser();

  await checkUserRole(event, "user");

  try {
    return { response: "Account fetched", account: userSession };
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "An error occurred during the fetching process " + err.message,
    });
  }
}, "guest");
