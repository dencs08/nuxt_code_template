import type { H3Event } from "h3";
import type { EventMetadata } from "~~/types/events";

async function getEventsUncached(
  event: H3Event,
  options: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: string;
  }
) {
  const client = event.context.backendClient;

  const events = await client.getEvents(options);
  return events;
}

export const getEvents = defineCachedFunction(
  async (
    event: H3Event,
    options: {
      limit?: number;
      offset?: number;
      sort?: string;
      order?: string;
    }
  ) => await getEventsUncached(event, options),
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
