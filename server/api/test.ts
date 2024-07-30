import { getBackendClient } from "../../lib/backend";
import mainConfig from "~/config/common/main";

export default defineEventHandler(async (event) => {
  try {
    const client = await getBackendClient(event);

    let data;
    if (mainConfig.BACKEND_PROVIDER === "supabase") {
      const { data: supabaseData, error } = await client
        .from("users")
        .select("*");
      if (error) {
        throw new Error(error.message);
      }
      data = supabaseData;
    } else if (mainConfig.BACKEND_PROVIDER === "prisma") {
      data = await client.users.findMany();
    }

    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
});
