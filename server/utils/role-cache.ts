import { getBackendClient } from "~~/lib/backend";
import type { Role } from "@/utils/types";

let cachedRoles: Role[] = [];
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getRoles(event: any): Promise<Role[]> {
  const currentTime = Date.now();
  if (
    cachedRoles.length === 0 ||
    currentTime - lastFetchTime > CACHE_DURATION
  ) {
    const client = await getBackendClient(event, false);
    const fetchedRoles = await client.getRoles();
    if (fetchedRoles && Array.isArray(fetchedRoles)) {
      cachedRoles = fetchedRoles;
      lastFetchTime = currentTime;
    } else {
      console.error("Failed to fetch roles or received invalid data");
    }
  }
  return cachedRoles;
}
