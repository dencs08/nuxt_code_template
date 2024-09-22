import { defineApiHandler } from "~~/server/utils/api-handler";

export default defineApiHandler(async (event) => {
  const client = event.context.backendClient;
  const user = event.context.user;

  try {
    // const response = await client.confirmEmail(userSession);
    // return { response };
  } catch (err: any) {
    return {
      error: "An error occurred during the confirmation process",
      response: err.message,
    };
  }
});
