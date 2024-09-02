import { getBackendClient } from "../../../../../lib/backend";
import { defineWrappedResponseHandler } from "../../../../../app/core/server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const body = await readBody(event);
  const { bucketName, filePath } = body;

  if (!bucketName || !filePath) {
    throw createError({
      statusCode: 400,
      message: "Missing required parameters",
    });
  }

  const client = await getBackendClient(event);

  try {
    const response = await client.deleteFile(bucketName, filePath);
    return response;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: (error as Error).message,
    });
  }
}, 0);
