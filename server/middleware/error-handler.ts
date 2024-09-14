import { defineEventHandler, H3Error } from "h3";

export default defineEventHandler((event) => {
  // Handle errors
  const handleError = (error: H3Error) => {
    console.error("Server Error:", {
      statusCode: error.statusCode,
      statusMessage: error.statusMessage,
      stack: error.stack,
    });
    // You can add additional error reporting logic here
    // For example, sending errors to a monitoring service
    // Optionally modify the error response
    if (process.env.NODE_ENV === "production") {
      // In production, you might want to hide error details
      error.statusMessage = "Internal Server Error";
      delete error.stack;
    }
  };
  // Catch any errors thrown during request processing
  event.node.res.on("error", handleError);
  // Continue processing the request
  return;
});
