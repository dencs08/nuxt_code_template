import type { RoutesNamesList } from "@typed-router/__routes";
import { validRoles } from "../roles";
import { routes } from "~~/config/common/routes";
import { dashboardMenu } from "~~/config/common/menus";
const { hasAccess: originalHasAccess } = useRoleCheck();
const localePath = useLocalePath();

export function mainDashboardNavigation() {
  const getAccessLevelForRoute = (input: any): number => {
    let routeName =
      typeof input === "object" && input !== null ? input.route : input;

    if (typeof routeName !== "string") {
      return 0; // Default to lowest access level
    }

    const routeMatch = routes.find((route) => route.newName === routeName);
    if (
      routeMatch &&
      routeMatch.settings &&
      typeof routeMatch.settings.access === "number"
    ) {
      return routeMatch.settings.access;
    }

    const pathSegments = routeName.split("-").filter(Boolean);
    const reversedSegments = pathSegments.reverse();

    for (const segment of reversedSegments) {
      const roleMatch = validRoles.find(
        (role) => segment.toLowerCase() === role.value
      );
      if (roleMatch) {
        return roleMatch.access_level;
      }
    }

    return 0; // Default to lowest access level
  };

  const hasAccess = (accessLevel: number) => {
    return originalHasAccess(accessLevel);
  };

  const filterNavigationItems = (items: any) => {
    return items.reduce((acc: any, item: any) => {
      const accessLevel = getAccessLevelForRoute(item.checkRoute || item.route);

      const hasItemAccess = hasAccess(accessLevel);

      if (hasItemAccess || (item.items && item.items.length > 0)) {
        let newItem = { ...item };

        if (newItem.route) {
          newItem.route = convertToLocalePath(newItem.route);
        }

        if (newItem.items && newItem.items.length > 0) {
          newItem.items = filterNavigationItems(newItem.items);
        }

        if (hasItemAccess || newItem.items.length > 0) {
          acc.push(newItem);
        }
      }

      return acc;
    }, []);
  };

  const convertToLocalePath = (routeName: string) => {
    return localePath({ name: routeName as RoutesNamesList });
  };

  const filteredDashboardNavigation = computed(() => {
    return filterNavigationItems(dashboardMenu);
  });

  return filteredDashboardNavigation;
}
