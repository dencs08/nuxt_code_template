import { PrismaClient } from "@prisma/client";

export interface IBackendProvider {
  initialize: () => Promise<void>;
  getUsers: () => Promise<any[]>;
  createUser: (userData: any) => Promise<any>;
  updateUser: (userId: string, userData: any) => Promise<any>;
  deleteUser: (userId: string) => Promise<void>;
  getPrismaClient?: () => PrismaClient;
}

export type BackendProviderType = "supabase" | "laravel";
