import { z } from "zod";

const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    password_confirm: z.string().min(6),
  })
  .superRefine(({ password_confirm, password }, ctx) => {
    if (password_confirm !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["password_confirm"],
      });
    }
  });

export default registerSchema;
