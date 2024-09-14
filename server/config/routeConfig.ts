import { type MethodConfig, routeConfigs } from "~~/config/routeRulesApi";

export function getRouteConfig(url: string, method: string): MethodConfig {
  const sortedRoutes = Object.entries(routeConfigs).sort(
    (a, b) => b[0].length - a[0].length || (b[0].includes("*") ? -1 : 1)
  );

  let matchedConfig: MethodConfig | null = null;

  for (const [pattern, config] of sortedRoutes) {
    if (matchRoute(url, pattern)) {
      if (!matchedConfig || !pattern.includes("*")) {
        matchedConfig = {
          ...config["*"],
          ...config[method.toUpperCase()],
        };
        if (!pattern.includes("*")) {
          break;
        }
      }
    }
  }

  return matchedConfig || { auth: false };
}

function matchRoute(url: string, pattern: string): boolean {
  const regexPattern = pattern.replace(/\//g, "\\/").replace(/\*\*/g, ".*");
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(url);
}
