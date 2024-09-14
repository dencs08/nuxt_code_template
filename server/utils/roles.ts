import type { H3Event } from "h3";
export function getAccessLevelByRole(roleValue: string, roles: any[]): number {
  const role = roles.find((r) => r.name === roleValue);
  return role ? role.access_level : 0;
}

const getRolesUncached = defineCachedFunction(async (event: any) => {
  const response = await event.context.backendClient.getRoles();
  return response;
});

export const getRoles = defineCachedFunction(
  async (event: H3Event) => await getRolesUncached(event),
  {
    maxAge: 60 * 60, // 1 hour
    swr: true,
    staleMaxAge: 60 * 60 * 24, // 24 hours
    name: "getRoles",
    getKey: (event) => "default",
    shouldBypassCache: (e) => getQuery(e).force === "true",
  }
);
