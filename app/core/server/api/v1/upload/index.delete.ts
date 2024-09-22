import { defineApiHandler } from "~~/server/utils/api-handler";

export default defineApiHandler(async (event) => {
  const body = await readBody(event);
  const { bucketName, filePath } = body;

  if (!bucketName || !filePath) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required parameters",
    });
  }

  const client = event.context.backendClient;

  try {
    const response = await client.deleteFile(bucketName, filePath);
    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.code || 500,
      statusMessage:
        error.statusMessage ||
        (error as Error).message ||
        "Failed to delete file",
    });
  }
});
