// /plugins/env-check.js
import mainConfig from "~~/config/common/main";

export default defineNuxtPlugin(() => {
  const requiredEnvVars = [
    // "NODE_ENV",
    // "BASE_URL",
    // "BASE_API_URL",
    // "NUXT_TURNSTILE_SECRET_KEY",
    // "NUXT_TURNSTILE_SITE_KEY",
    // "APOLLO_GRAPHQL_URL",
    // "STORYBOOK_URL",
    // "STORYBOOK_PORT",
  ];

  //   if (
  //     mainConfig.BACKEND_PROVIDER === "supabase" ||
  //     mainConfig.AUTH_PROVIDER === "supabase"
  //   ) {
  //     requiredEnvVars.push("SUPABASE_URL", "SUPABASE_SERVICE_KEY");
  //   }

  //   const missingEnvVars = requiredEnvVars.filter(
  //     (envVar) => !process.env[envVar]
  //   );

  //   if (missingEnvVars.length) {
  //     const missingVarsString = missingEnvVars.join(", ");
  //     console.error(
  //       `Missing required environment variables: ${missingVarsString}`
  //     );
  //     throw new Error(
  //       `Missing required environment variables: ${missingVarsString}`
  //     );
  //   }

  // console.log("Global Route Auth:", mainConfig.GLOBAL_ROUTE_AUTH);
  // console.log("Backend Provider:", mainConfig.BACKEND_PROVIDER);
});
