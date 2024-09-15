// server/config/rateLimiterConfig.ts

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  delayMs?: number; // Optional delay property
}

interface ApiRateLimiterConfig {
  [key: string]: RateLimitConfig; // Index signature to allow dynamic keys
}

export default {
  default: {
    windowMs: 60 * 60 * 1000, // 1 hour window
    maxRequests: 1000, // Max requests per hour per IP
  },
  api: {
    "/api/v1/**": {
      windowMs: 60 * 1000, // 1 minute window
      maxRequests: 30, // Max 10 requests per minute per IP
    },
    "/api/v2/**": {
      windowMs: 30 * 1000, // 30 seconds window
      maxRequests: 20, // Max 5 requests per 30 seconds per IP
    },
  } as ApiRateLimiterConfig,
};
