// utils/types.ts
export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    photo: string;
    role?: string;
    user_roles?: { role: string };
    provider?: string;
}

export type Severity = "success" | "info" | "warn" | "error";

export type SessionScope = "global" | "local" | "others";
