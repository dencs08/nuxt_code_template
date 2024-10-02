import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { saveEvent } from "~~/app/core/server/controllers/eventsController";
import { z } from "zod";

const userSchema = z.object({
  name: z.string(),
  password: z.string(),
  role_id: z.number(),
  email: z.string().email(),
  password_confirm: z.string().optional(),
  nickname: z.string().optional(),
  photo: z.string().optional(),
});

export default defineApiHandler(async (event) => {
  const server = event.context.backendClient;
  const currentUser = event.context.user;

  const body = await validateBody(event, { schema: userSchema });

  const nickname =
    body.nickname || (await generateUniqueNickname(body.name, server));

  const data = {
    name: body.name,
    email: body.email,
    password: body.password,
    role_id: body.role_id,
    photo: body.photo,
  };

  const user = await server.createUser(data, event, currentUser);
  await server.updateUser({ id: user.id, nickname: nickname });
  await saveEvent(event, {
    action: "CREATE",
    title: "User created",
    details: `has created`,
    metadata: {
      action_by: currentUser.id,
      action_on: user.id,
    },
  });
  return user;
});

async function generateUniqueNickname(
  name: string,
  server: any
): Promise<string | null> {
  const baseName = name.toLowerCase().replace(/\s+/g, "").slice(0, 5);
  const maxAttempts = 10;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const randomSuffix = generateRandomString(5);
    const nickname = `${baseName}${randomSuffix}`;

    const isUnique = await server.isNicknameUnique(nickname);
    if (isUnique) {
      return nickname;
    }
  }

  return null; // Return null if no unique nickname was found after 10 attempts
}

function generateRandomString(length: number): string {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
