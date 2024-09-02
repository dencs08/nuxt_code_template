// server/api/upload.ts
import { getBackendClient } from "../../../../../lib/backend";
import { defineWrappedResponseHandler } from "../../../../../app/core/server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const body = await readBody(event);
  const { bucketName, filePath, file, upsert, contentType } = body;

  if (!bucketName || !filePath || !file || !contentType) {
    throw createError({
      statusCode: 400,
      message: "Missing required parameters",
    });
  }

  const client = await getBackendClient(event);

  try {
    const response = await client.uploadFile(
      bucketName,
      filePath,
      file,
      contentType,
      upsert
    );
    return response;
  } catch (error) {
    console.error("Upload error:", error);
    throw createError({
      statusCode: 500,
      message: (error as Error).message,
    });
  }
}, 0);
