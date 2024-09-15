// config/routeRules.ts

export default {
  // pre-rendered at build time
  // "/contact": { prerender: true },

  // Auth pages rendered only on client-side
  "/auth/**": { ssr: false },
  "/auth": { ssr: false },
  "/:locale/auth": { ssr: false },
  "/:locale/auth/**": { ssr: false },
  "/:lang/auth": { ssr: false },
  "/:lang/auth/**": { ssr: false },

  // Admin dashboard renders only on client-side
  "/dashboard": { ssr: false },
  "/dashboard/**": { ssr: false },
  "/:locale/dashboard": { ssr: false },
  "/:locale/dashboard/**": { ssr: false },
  "/:lang/dashboard": { ssr: false },
  "/:lang/dashboard/**": { ssr: false },

  // Main pages rendered only on client-side
  "/main": { ssr: false },
  "/main/**": { ssr: false },
  "/:locale/main": { ssr: false },
  "/:locale/main/**": { ssr: false },
  "/:lang/main": { ssr: false },
  "/:lang/main/**": { ssr: false },

  // Product page generated on-demand, revalidates in background
  // '/products/**': { swr: 3600 },
  // // Blog post generated on-demand once until next deploy
  // '/blog/**': { isr: true },
  // // Add cors headers on API routes
  // '/api/**': { cors: true },
  // // Redirects legacy urls
  // '/old-page': { redirect: '/new-page' }
};
