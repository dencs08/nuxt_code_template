import { defineEventHandler } from "h3";
import { getRateLimiter } from "../utils/rateLimiter";

export default defineEventHandler((event) => {
  const headers = getRequestHeaders(event);
  const route = event.node.req.url || "";

  const rateLimiter = getRateLimiter(route);

  rateLimiter(event.node.req, event.node.res, () => {
    return;
  });
});
