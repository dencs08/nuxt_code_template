import { defineNuxtPlugin } from "#app";
import { getSessionId } from "../utils/session";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("page:finish", async (context) => {
    const sessionId = getSessionId();
    const pageUrl = window.location.href;
    const referrer = document.referrer;
    const timestamp = new Date().toISOString();

    // Extract the path from the current URL
    const path = new URL(pageUrl).pathname;

    // Function to check if the path matches our criteria
    const shouldLogPath = (path: any) => {
      // Remove leading and trailing slashes
      const cleanPath = path.replace(/^\/|\/$/g, "");

      // Split the path into segments
      const segments = cleanPath.split("/");

      // Check if it's the home page or a single-segment localized home page
      if (segments.length <= 1) return true;

      // Check if it's the contact page (localized or not)
      if (segments.length <= 2 && segments[segments.length - 1] === "contact")
        return true;

      return false;
    };

    if (shouldLogPath(path)) {
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
    }
  });
});
