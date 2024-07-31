import mainConfig from "~/config/common/main";
import type { BackendClient } from "../types/backend";
import { SupabaseClient } from "./supabaseClient";
import { PrismaClient } from "./prismaClient";

let backendClient: BackendClient | null = null;

export const getBackendClient = async (
  event: any,
  bypass: boolean = false
): Promise<BackendClient> => {
  if (!backendClient) {
    if (mainConfig.BACKEND_PROVIDER === "supabase") {
      const { serverSupabaseClient, serverSupabaseServiceRole } = await import(
        "#supabase/server"
      );
      const supabaseClient = bypass
        ? await serverSupabaseServiceRole(event)
        : await serverSupabaseClient(event);
      backendClient = new SupabaseClient(supabaseClient);
    } else if (mainConfig.BACKEND_PROVIDER === "prisma") {
      const { default: prisma } = await import("./prisma");
      backendClient = new PrismaClient(prisma);
    } else {
      throw new Error(
        `Unsupported backend provider: ${mainConfig.BACKEND_PROVIDER}`
      );
    }
  }
  return backendClient;
};
