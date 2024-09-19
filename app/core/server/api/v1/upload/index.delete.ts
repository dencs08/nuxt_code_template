import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const body = await readBody(event);
  const { bucketName, filePath } = body;

  if (!bucketName || !filePath) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required parameters",
    });
  }

  const client = await getBackendClient(event);

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
}, 0);
