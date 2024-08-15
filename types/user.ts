import { z } from "zod";
import { userSchema } from "../utils/schemas";

export type UserForm = z.infer<typeof userSchema>;

export interface UserAuthPublicSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  role?: string;
  user_roles?: { role_id: number; roles: { name: string } };
  provider?: string;
  metadata?: any;
  app_metadata?: any;
}
