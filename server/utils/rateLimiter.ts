// server/utils/rateLimiter.ts

import rateLimiterConfig from "../config/rateLimiterConfig";

interface RateLimitData {
  count: number;
  startTime: number;
}

// A simple in-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitData>();

// Utility function to check if a route matches a pattern with wildcards
function matchesPattern(route: string, pattern: string): boolean {
  // Replace "**" with a regex pattern that matches any character
  const regexPattern = new RegExp(
    `^${pattern.replace(/\*\*/g, ".*").replace(/\//g, "\\/")}$`
  );
  return regexPattern.test(route);
}

export function getRateLimiter(route: string) {
  let config = rateLimiterConfig.default;

  // Sort patterns to prioritize specific routes over wildcard matches
  const sortedPatterns = Object.entries(rateLimiterConfig.api).sort(
    ([a], [b]) => {
      // Sort by length (longer patterns first) to ensure specificity
      return b.length - a.length;
    }
  );

  // Determine the correct config by matching the route against sorted patterns
  for (const [pattern, conf] of sortedPatterns) {
    if (matchesPattern(route, pattern)) {
      config = conf;
      break;
    }
  }

  return (req: any, res: any, next: any) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const now = Date.now();
    const key = `${route}-${ip}`;
    const rateLimitData = rateLimitStore.get(key) || {
      count: 0,
      startTime: now,
    };

    // Check if the time window has passed
    if (now - rateLimitData.startTime > config.windowMs) {
      rateLimitData.count = 1;
      rateLimitData.startTime = now;
    } else {
      rateLimitData.count++;
    }

    // Update the store with the new data
    rateLimitStore.set(key, rateLimitData);

    if (rateLimitData.count > config.maxRequests) {
      res.statusCode = 429;
      res.end(
        JSON.stringify({ error: "Too many requests, please try again later." })
      );
    } else {
      next();
    }
  };
}
