import type { H3Event } from "h3";
import type { EventMetadata } from "~~/types/events";
import type { PaginationParams } from "~~/types/pagination";
async function getEventsUncached(event: H3Event) {
  const client = event.context.backendClient;
  const params = getQuery(event) as PaginationParams;

  const events = await client.getEvents(params);
  return events;
}

export const getEvents = defineCachedFunction(
  async (event: H3Event) => await getEventsUncached(event),
  {
    maxAge: 60 * 1, // 1 minute
    swr: true,
    staleMaxAge: 60 * 60 * 1, // 1 hour
    name: "getEvents",
    getKey: (event) => {
      return "default";
    },
    shouldBypassCache: async (e) => getQuery(e).force === "true",
  }
);

export const saveEvent = async (
  event: H3Event,
  options: {
    action: string;
    title: string;
    details: any;
    metadata: EventMetadata;
  }
) => {
  const client = event.context.backendClient;
  const response = await client.saveEvent(
    options.action,
    options.title,
    options.details,
    options.metadata
  );
  return response;
};
