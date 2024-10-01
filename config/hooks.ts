import { routes } from "./common/routes";
import { roles } from "../config/common/roles";
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
        if (globalAccess !== undefined) page.meta.access = globalAccess;

        // Apply settings from routeSettings
        const settings = routeMatch.settings;
        if (settings) {
          if (settings.auth !== undefined) page.meta.auth = settings.auth;
          if (settings.access !== undefined) page.meta.access = settings.access;
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
