export default defineApiHandler(async (event) => {
  const client = event.context.backendClient;
  const body = await readBody(event);

  try {
    const data = await client.deleteUser(body.userId);
    return data;
  } catch (err: any) {
    throw createError({
      statusCode: err.code || 500,
      statusMessage: err.message,
    });
  }
});
