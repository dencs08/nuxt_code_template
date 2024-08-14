import { z } from "zod";
import { emailSchema } from "~~/utils/schemas";

export type EmailForm = z.infer<typeof emailSchema>;
