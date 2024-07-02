import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3).max(25),
  password: z.string().min(6),
  password_confirm: z.string().min(6),
  role: z.string(),
}).superRefine(({ password_confirm, password }, ctx) => {
  if (password_confirm !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ['password_confirm']
    });
  }
});

export default userSchema;
