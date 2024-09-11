import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";
import mjml2html from "mjml";

export default defineWrappedResponseHandler(async (event) => {
  const body = await readBody(event);

  if (!body.mjmlContent) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing MJML content",
    });
  }

  try {
    const { html, errors } = mjml2html(body.mjmlContent);

    if (errors.length) {
      console.warn("MJML Warnings:", errors);
    }

    return { html };
  } catch (error: any) {
    console.error("Error rendering MJML:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to render MJML",
    });
  }
}, 25);
