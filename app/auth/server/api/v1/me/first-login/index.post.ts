import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";

const firstLoginSchema = z.object({
  password: z.string(),
  name: z.string(),
  nickname: z.string(),
  password_confirm: z.string(),
});

export default defineApiHandler(async (event) => {
  const storage = useStorage();
  const user = event.context.user;
  const isVerified = await storage.getItem(`user:${user.id}:first-login`);

  if (!isVerified) {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorized: First login expired...",
    });
  }

  const body = await validateBody(event, { schema: firstLoginSchema });

  const password = body.password;
  const name = body.name;
  const nickname = body.nickname;
  const password_confirm = body.password_confirm;

  if (password !== password_confirm) {
    console.log("Passwords do not match");
    throw createError({
      statusCode: 400,
      statusMessage: "Passwords do not match",
    });
  }

  const client = event.context.backendClient;
  try {
    const updatePasswordResponse = await client.updatePassword(user, password);

    const updateUserResponse = await client.updateMe(user, {
      name,
      nickname,
    });

    await storage.removeItem(`user:${user.id}:first-login`);
    return "User updated successfully";
  } catch (err: any) {
    console.log(err.code, err.message);
    throw createError({
      statusCode: err.code,
      statusMessage: err.message,
    });
  }
});
