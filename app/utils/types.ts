// utils/types.ts
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
}

export type Role = {
  id?: number;
  value: string;
  name: string;
  access_level: number;
};

export type Severity = "success" | "info" | "warn" | "error";

export type SessionScope = "global" | "local" | "others";
