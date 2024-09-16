import { defineNuxtPlugin } from "#app";
import { getSessionId } from "../utils/session";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("page:finish", async (context) => {
    const sessionId = getSessionId();
    const pageUrl = window.location.href;
    const referrer = document.referrer;
    const timestamp = new Date().toISOString();

    try {
      // Send the page view data to the API endpoint
      await $fetch("/api/v1/analytics/page-views", {
        method: "POST",
        body: {
          session_id: sessionId,
          page_url: pageUrl,
          referrer,
          timestamp,
        },
      });
    } catch (error) {
      console.error("Error logging page view:", error);
    }
  });
});
