import { defineWrappedResponseHandler } from "../../utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const body = await readBody(event);

  if (!body.role || !body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required data",
    });
  }

  await assignRole(event, body);
}, "admin");
