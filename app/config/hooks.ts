import { routes } from "../config/common/routes";
import { validRoles } from "../utils/roles";
import mainConfig from "./common/main";

const globalAuth = mainConfig.GLOBAL_ROUTE_AUTH === "true";
const globalAccess = mainConfig.GLOBAL_ROUTE_ACCESS;

export default {
  "pages:extend": (pages: any) => {
    pages.forEach((page: any) => {
      page.meta = page.meta || {};

      const routeMatch = routes.find((route) => route.name === page.name);
      if (routeMatch) {
        page.path = routeMatch.path;
        page.name = routeMatch.newName;

        // Apply global settings as a base
        if (globalAuth) page.meta.auth = true;
        if (globalAccess) page.meta.access = globalAccess;

        // Automatically determine and possibly override access based on the path
        const accessLevel = determineAccessLevelFromPath(page.path);
        if (accessLevel) {
          page.meta.access = accessLevel;
        }

        // Apply or override settings from routeSettings
        const settings = routeMatch.settings;
        if (settings) {
          if (settings.auth !== undefined) page.meta.auth = settings.auth;
          if (settings.access) page.meta.access = settings.access;
        }
      }
    });
  },
  "build:manifest": (manifest: any) => {
    const css = manifest["node_modules/nuxt/dist/app/entry.js"]?.css;
    if (css) {
      for (let i = css.length - 1; i >= 0; i--) {
        if (css[i].startsWith("entry")) css.splice(i, 1);
      }
    }
  },
};

function determineAccessLevelFromPath(path: string): string | undefined {
  const pathSegments = path.split("/").filter(Boolean);
  const reversedSegments = pathSegments.reverse();
  let matchedRole = undefined;

  for (const segment of reversedSegments) {
    const roleMatch = validRoles.find(
      (role) => segment.toLowerCase() === role.value
    );
    if (roleMatch) {
      matchedRole = roleMatch.value;
      break;
    }
  }

  return matchedRole;
}
