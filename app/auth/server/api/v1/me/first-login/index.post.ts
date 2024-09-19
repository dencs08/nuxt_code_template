import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event, userSession) => {
  const storage = useStorage();
  const isVerified = await storage.getItem(
    `user:${userSession.id}:first-login`
  );

  if (!isVerified) {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorized: First login expired...",
    });
  }

  const client = await getBackendClient(event);
  const body = await readBody(event);

  const password = body.password;
  const name = body.name;
  const nickname = body.nickname;
  const password_confirm = body.password_confirm;

  if (!password || !name || !nickname) {
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

    const updateUserResponse = await client.updateMe(userSession, {
      name,
      nickname,
    });

    await storage.removeItem(`user:${userSession.id}:first-login`);
    return "User updated successfully";
  } catch (err: any) {
    console.log(err.code, err.message);
    throw createError({
      statusCode: err.code,
      statusMessage: err.message,
    });
  }
}, 0);
