import type { H3Event } from "h3";

async function getRolesUncached(event: any) {
  const response = await event.context.backendClient.getRoles();
  return response;
}

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
