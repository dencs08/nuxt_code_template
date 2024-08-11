import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const body = await readBody(event);
  const { id } = event.context.params as { id: string };

  if (!body.role || !body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required data",
    });
  }
  if (id !== body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID mismatch",
    });
  }

  const response = await assignRole(event, body);
  return response;
}, 75);
