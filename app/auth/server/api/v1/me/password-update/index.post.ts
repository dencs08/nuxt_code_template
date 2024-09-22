import { defineApiHandler } from "~~/server/utils/api-handler";

export default defineApiHandler(async (event) => {
  const user = event.context.user;
  const storage = useStorage();
  const isVerified = await storage.getItem(`user:${user.id}:password-reset`);

  if (!isVerified) {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorized: Password reset not initiated or expired",
    });
  }

  const client = event.context.backendClient;
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
    const updatePasswordResponse = await client.updatePassword(user, password);
    await storage.removeItem(`user:${user.id}:password-reset`);
    return "Password updated successfully";
  } catch (err: any) {
    console.log(err.code, err.message);
    throw createError({
      statusCode: err.code,
      statusMessage: err.message,
    });
  }
});
