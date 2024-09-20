import { defineNitroPlugin } from "nitropack/runtime/plugin";
import { H3Error } from "h3";
import { BaseError } from "~~/server/utils/errors";

const getProductionErrorMessage = (statusCode: number): string => {
  switch (statusCode) {
    case 400:
      return "Invalid request. Please check your input and try again.";
    case 401:
      return "Authentication required. Please log in and try again.";
    case 403:
      return "You don't have permission to access this resource.";
    case 404:
      return "The requested resource could not be found.";
    default:
      return "An unexpected error occurred. Please try again later.";
  }
};

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook("error", async (error, { event }) => {
    const isDev = process.env.NODE_ENV === "development";
    if (!event) {
      console.error("Application error (no event context):", error);
      return;
    }

    if (isDev) {
      console.error(`${event.path} Application error:`, error);
    }

    let statusCode = 500;
    let statusMessage = "An unexpected error occurred";

    if (error instanceof BaseError || error instanceof H3Error) {
      statusCode = error.statusCode || 500;
      statusMessage = error.message || "An unexpected error occurred";
    }

    if (event.node && event.node.res) {
      event.node.res.statusCode = statusCode;

      let errorResponse;

      if (isDev) {
        errorResponse = {
          statusCode,
          statusMessage: error instanceof Error ? error.message : statusMessage,
          stack: (error as Error).stack,
        };
      } else {
        statusMessage = getProductionErrorMessage(statusCode);
        errorResponse = { statusCode, statusMessage };
      }

      if (error instanceof Error) {
        error.statusCode = statusCode;
        error.statusMessage = statusMessage;
        if (isDev) {
          (error as any).stack = (error as Error).stack;
        }
      }

      event.node.res.setHeader("Content-Type", "application/json");
      event.node.res.end(JSON.stringify(errorResponse));
    }

    return true;
  });
});
