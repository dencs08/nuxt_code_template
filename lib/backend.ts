// lib/backend.ts
import mainConfig from "~/config/common/main";

let backendClient: any;

const getBackendClient = async (event: any, bypass: boolean = false) => {
  if (!backendClient) {
    if (mainConfig.BACKEND_PROVIDER === "supabase") {
      const { serverSupabaseClient, serverSupabaseServiceRole } = await import(
        "#supabase/server"
      );
      backendClient = bypass
        ? serverSupabaseServiceRole(event)
        : serverSupabaseClient(event);
    } else if (mainConfig.BACKEND_PROVIDER === "prisma") {
      const { default: prisma } = await import("./prisma");
      backendClient = prisma;
    }
  }
  return backendClient;
};

export { getBackendClient };
