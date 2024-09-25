import { defineApiHandler } from "~~/server/utils/api-handler";
import { validateBody } from "~~/utils/validate";
import { z } from "zod";

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role_id: z.string(),
  photo: z.string().optional(),
});

export default defineApiHandler(async (event) => {
  const server = event.context.backendClient;
  const currentUser = event.context.user;

  const body = await validateBody(event, { schema: userSchema });

  const data = {
    name: body.name,
    email: body.email,
    password: body.password,
    role_id: body.role_id,
    photo: body.photo,
  };

  const user = await server.createUser(data, event, currentUser);
  return user;
});
