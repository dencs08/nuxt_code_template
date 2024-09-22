import { defineApiHandler } from "~~/server/utils/api-handler";
export default defineApiHandler(async (event) => {
  const client = event.context.backendClient;
  const user = event.context.user;
  try {
    const response = await client.getMePermissions(user.id);
    return response;
  } catch (error) {
    throw error;
  }
});
