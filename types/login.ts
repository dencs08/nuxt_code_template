import { z } from "zod";
import { loginSchema } from "~~/utils/schemas";

export type LoginForm = z.infer<typeof loginSchema>;
