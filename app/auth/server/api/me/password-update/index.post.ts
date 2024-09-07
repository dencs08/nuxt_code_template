import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event, userSession) => {
  const storage = useStorage();
  const isVerified = await storage.getItem(
    `user:${userSession.id}:password-reset`
  );

  if (!isVerified) {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorized: Password reset not initiated or expired",
    });
  }

  const client = await getBackendClient(event);
  const body = await readBody(event);

  const password = body.password;
  const password_confirm = body.password_confirm;

  if (!password) {
    console.log("Missing data");
    throw createError({
      statusCode: 400,
      statusMessage: "Missing data",
    });
  }

  if (password !== password_confirm) {
    console.log("Passwords do not match");
    throw createError({
      statusCode: 400,
      statusMessage: "Passwords do not match",
    });
  }

  try {
    const updatePasswordResponse = await client.updatePassword(
      userSession,
      password
    );
    await storage.removeItem(`user:${userSession.id}:password-reset`);
    return "Password updated successfully";
  } catch (err: any) {
    console.log(err.code, err.message);
    throw createError({
      statusCode: err.code,
      statusMessage: err.message,
    });
  }
}, 0);
