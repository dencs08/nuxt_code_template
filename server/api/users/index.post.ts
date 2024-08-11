import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "../../utils/defaultHandler";
import { UserAuthPublicSession } from "@/utils/types";

export default defineWrappedResponseHandler(async (event) => {
  const client = await getBackendClient(event, true);
  let body = await readBody(event);

  try {
    const user = await client.createUser(body, event);
    return user;
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err,
    });
  }
}, 75);
