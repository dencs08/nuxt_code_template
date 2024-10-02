import { saveEvent } from "~~/app/core/server/controllers/eventsController";

export default defineApiHandler(async (event) => {
  const client = event.context.backendClient;
  const currentUser = event.context.user;
  const body = await readBody(event);

  try {
    const user = await client.getUser(body.userId);
    const data = await client.deleteUser(body.userId);
    await saveEvent(event, {
      action: "DELETE",
      title: "User deleted",
      details: `has deleted`,
      metadata: {
        action_by: currentUser.id,
        action_on: user.email,
      },
    });
    return data;
  } catch (err: any) {
    throw createError({
      statusCode: err.code || 500,
      statusMessage: err.message,
    });
  }
});
