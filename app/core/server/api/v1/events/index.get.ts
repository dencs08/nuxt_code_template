import { getEvents } from "~/core/server/controllers/eventsController";

export default defineApiHandler(async (event) => {
  const params = getQuery(event);
  const options = {
    limit: params.limit,
    offset: params.offset,
    sort: params.sort,
    order: params.order,
  };
  const events = await getEvents(event, options);
  return events;
});
