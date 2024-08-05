import mainConfig from "~/config/common/main";
import type { BackendClient } from "../types/backend";
import { SupabaseClient } from "./supabaseClient";
import { PrismaClient } from "./prismaClient";
import {
  serverSupabaseClient,
  serverSupabaseServiceRole,
} from "#supabase/server";

let regularBackendClient: any;
let bypassedBackendClient: any;

export const getBackendClient = async (
  event: any,
  bypass: boolean = false
): Promise<BackendClient> => {
  if (mainConfig.BACKEND_PROVIDER === "supabase") {
    if (bypass) {
      if (!bypassedBackendClient) {
        const supabaseClient = await serverSupabaseServiceRole(event);
        bypassedBackendClient = new SupabaseClient(supabaseClient);
      }
      return bypassedBackendClient;
    } else {
      if (!regularBackendClient) {
        const supabaseClient = await serverSupabaseClient(event);
        regularBackendClient = new SupabaseClient(supabaseClient);
      }
      return regularBackendClient;
    }
  } else if (mainConfig.BACKEND_PROVIDER === "prisma") {
    if (!regularBackendClient) {
      const { default: prisma } = await import("./prisma");
      regularBackendClient = new PrismaClient(prisma);
    }
    return regularBackendClient;
  } else {
    throw new Error(
      `Unsupported backend provider: ${mainConfig.BACKEND_PROVIDER}`
    );
  }
};
