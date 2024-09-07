import { z } from "zod";
import { passwordUpdateOtpSchema } from "~~/utils/schemas";

export type PasswordUpdateOtp = z.infer<typeof passwordUpdateOtpSchema>;
