import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB max file size
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];

export default defineWrappedResponseHandler(async (event, userSession) => {
  const body = await readBody(event);
  const { file, contentType } = body;
  const oldPhotoUrl = userSession.photo;

  // Validate file
  if (!file || !contentType) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing file or content type",
    });
  }

  // Check file size
  if (Buffer.from(file, "base64").length > MAX_FILE_SIZE) {
    throw createError({
      statusCode: 400,
      statusMessage: "File size exceeds maximum allowed size",
    });
  }

  // Check file type
  if (!ALLOWED_MIME_TYPES.includes(contentType)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid file type",
    });
  }

  const client = await getBackendClient(event, true);

  try {
    // Generate a unique filename
    const fileName = `avatar_${Date.now()}.${contentType.split("/")[1]}`;
    const bucketName = "user_avatars";
    const filePath = `${userSession.id}/${fileName}`;

    // Upload new avatar
    const uploadResponse = await client.uploadFile(
      bucketName,
      filePath,
      file,
      contentType,
      true // upsert
    );

    // Update user's avatar in the database
    await client.updateMePhoto(userSession.id, uploadResponse.publicUrl);

    // Delete old avatar if exists
    if (oldPhotoUrl) {
      const oldFilePath = getFilePathFromUrl(oldPhotoUrl, bucketName);
      if (oldFilePath) {
        await client.deleteFile(bucketName, oldFilePath);
      }
    }

    return { success: true, avatarUrl: uploadResponse.publicUrl };
  } catch (error: any) {
    console.error("Upload error:", error);
    throw createError({
      statusCode: error.code || 500,
      statusMessage:
        error.statusMessage || error.message || "Failed to upload file",
    });
  }
}, 0);

// Helper function to extract file path from URL
function getFilePathFromUrl(url: string, bucketName: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const bucketIndex = pathParts.indexOf(bucketName);
    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
      return pathParts.slice(bucketIndex + 1).join("/");
    }
  } catch (error) {
    console.error("Error parsing URL:", error);
  }
  return null;
}
