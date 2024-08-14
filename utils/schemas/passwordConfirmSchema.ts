import { z } from 'zod';

const passwordConfirmSchema = z.object({
  password: z.string().min(6),
  password_confirm: z.string().min(6),
}).superRefine(({ password_confirm, password }, ctx) => {
  if (password_confirm !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords are not the same",
      path: ['password_confirm']
    });
  }
});

export default passwordConfirmSchema;
