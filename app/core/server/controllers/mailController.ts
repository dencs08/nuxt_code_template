import mjml2html from "mjml";
import crypto from "crypto";

function hash(content: string) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

const getMailRenderUncached = async (mjmlContent: string) => {
  if (!mjmlContent) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing MJML content",
    });
  }

  try {
    const { html, errors } = mjml2html(mjmlContent);

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
};

export const getMailRender = defineCachedFunction(
  async (mjmlContent: string) => await getMailRenderUncached(mjmlContent),
  {
    maxAge: 60 * 60, // 1 hour
    swr: true,
    staleMaxAge: 60 * 60 * 24, // 24 hours
    name: "getMailRender",
    getKey: (mjmlContent) => hash(mjmlContent),
    shouldBypassCache: (mjmlContent, force) => force === "true",
  }
);
