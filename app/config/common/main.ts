//file for most common configurations

// BACKEND_PROVIDER supabase | prisma
// AUTH_PROVIDER supabase | sidebase
// AUTH_SIDEBASE authjs | local | refresh
//TODO change gloablrouteaccess to a level of access and not a name of a role
export default {
  GLOBAL_ROUTE_AUTH: "true",
  GLOBAL_ROUTE_ACCESS: "guest",
  BACKEND_PROVIDER: "supabase",
  AUTH_PROVIDER: "supabase",
  AUTH_SIDEBASE: "authjs",
};
