import { getBackendClient } from "../../lib/backend";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("request", async (event) => {
    if (!event.context.backendClient) {
      event.context.backendClient = await getBackendClient(event, true);
    }
  });
});
