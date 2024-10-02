import { getEvents } from "~/core/server/controllers/eventsController";
export default defineApiHandler(async (event) => {
  const events = await getEvents(event);
  return events;
});
