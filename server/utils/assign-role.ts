import { getBackendClient } from "../../lib/backend";

export async function assignRole(
  event: any,
  body: { id: string; role: string }
) {
  const client = await getBackendClient(event, true);
  const response = await client.assignRole(event, body);
  return response;
}
