// config/routeRules.ts

export default {
  // Homepage pre-rendered at build time
  "/": { ssr: true },
  "/contact": { prerender: true },
  "/auth/verify": { ssr: false },
  // Admin dashboard renders only on client-side
  "/dashboard": { ssr: false },
  "/dashboard/**": { ssr: false },
  "/:locale/dashboard": { ssr: false },
  "/:locale/dashboard/**": { ssr: false },
  "/:lang/dashboard": { ssr: false },
  "/:lang/dashboard/**": { ssr: false },
  // Product page generated on-demand, revalidates in background
  // '/products/**': { swr: 3600 },
  // // Blog post generated on-demand once until next deploy
  // '/blog/**': { isr: true },
  // // Add cors headers on API routes
  // '/api/**': { cors: true },
  // // Redirects legacy urls
  // '/old-page': { redirect: '/new-page' }
};
