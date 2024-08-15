import mainConfig from "../config/common/main";
import type { BackendClient } from "../types/backend";
import { SupabaseClient } from "./supabaseClient";
import { PrismaClient } from "./prismaClient";
import {
  serverSupabaseClient,
  serverSupabaseServiceRole,
} from "#supabase/server";

export const getBackendClient = async (
  event: any,
  bypass: boolean = false
): Promise<BackendClient> => {
  if (mainConfig.BACKEND_PROVIDER === "supabase") {
    const supabaseClient = bypass
      ? await serverSupabaseServiceRole(event)
      : await serverSupabaseClient(event);
    return new SupabaseClient(supabaseClient);
  } else if (mainConfig.BACKEND_PROVIDER === "prisma") {
    const { default: prisma } = await import("./prisma");
    return new PrismaClient(prisma);
  } else {
    throw new Error(
      `Unsupported backend provider: ${mainConfig.BACKEND_PROVIDER}`
    );
  }
};
