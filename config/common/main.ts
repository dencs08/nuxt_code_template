//file for most common configurations

// BACKEND_PROVIDER supabase | prisma
// AUTH_PROVIDER supabase | sidebase
// AUTH_SIDEBASE authjs | local | refresh
export default {
  GLOBAL_ROUTE_AUTH: "true",
  GLOBAL_ROUTE_ACCESS: 0,
  BACKEND_PROVIDER: "supabase",
  AUTH_PROVIDER: "supabase",
  AUTH_SIDEBASE: "authjs",
};
