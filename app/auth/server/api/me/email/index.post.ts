import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event, userSession) => {
  const client = await getBackendClient(event);
  const body = await readBody(event);
  try {
    if (body.email && body.email !== userSession.email) {
      if (userSession.provider != "email") return;
      //no need to implement as moved to the supabase funcionality and hopefuly sidebase auth will also handle it
      return "Email ready to be updated";
    }
    return { error: "Error" };
  } catch (err: any) {
    throw createError({
      statusCode: err.code || 500,
      statusMessage:
        err.message || "An error occurred during the update process",
    });
  }
}, 0);
