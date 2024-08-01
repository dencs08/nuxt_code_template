import { getBackendClient } from "../../lib/backend";

export default defineEventHandler(async (event) => {
  try {
    const client = await getBackendClient(event);
    const data = await client.getCurrentUser();
    return data;
  } catch (error: any) {
    console.error("Error in API route:", error);
    return { error: error.message };
  }
});
