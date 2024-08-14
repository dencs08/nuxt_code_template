import { z } from "zod";
import { passwordConfirmSchema } from "~~/utils/schemas";

export type PasswordConfirm = z.infer<typeof passwordConfirmSchema>;
