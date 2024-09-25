import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";

// Define the schema for the request body
const passwordUpdateSchema = z.object({
  password: z.string(),
  password_confirm: z.string(),
});

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
  const body = await validateBody(event, { schema: passwordUpdateSchema });

  const password = body.password;
  const password_confirm = body.password_confirm;

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
