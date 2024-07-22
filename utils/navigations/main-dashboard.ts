import type { RoutesNamesList } from "@typed-router/__routes";
import { validRoles } from "../roles";
import { routes } from "@/config/common/routes";
import { dashboardMenu } from "@/config/common/menus";
const { hasAccess: originalHasAccess } = useRoleCheck();
const localePath = useLocalePath();

// main-dashboard.ts
export function mainDashboardNavigation() {
  const getAccessLevelForRoute = (input: any): string => {
    // Handle cases where input is an object with a 'route' key
    let routeName =
      typeof input === "object" && input !== null ? input.route : input;

    // Ensure routeName is a string before proceeding
    if (typeof routeName !== "string") {
      return ""; // Return a default value indicating no specific access
    }

    // First, try to get an explicit setting from the combined routes structure
    const routeMatch = routes.find((route) => route.newName === routeName);
    if (routeMatch && routeMatch.settings && routeMatch.settings.access) {
      return routeMatch.settings.access; // If an explicit setting is found, return it immediately
    }

    // If no explicit setting is found, attempt to determine the access level from the route path
    const pathSegments = routeName.split("-").filter(Boolean); // Remove any empty segments
    const reversedSegments = pathSegments.reverse();

    for (const segment of reversedSegments) {
      const roleMatch = validRoles.find(
        (role) => segment.toLowerCase() === role.value
      );
      if (roleMatch) {
        return roleMatch.value; // If a matching role is found, return its value as the access level
      }
    }

    return ""; // Default to no specific access level if no matches are found
  };

  const hasAccess = (accessLevel: string) => {
    if (!accessLevel) return true; //if no access level is set, allow access
    return originalHasAccess(accessLevel);
  };

  const filterNavigationItems = (items: any) => {
    return items.reduce((acc: any, item: any) => {
      // Check if the current item or any of its sub-items have access
      const accessLevel = getAccessLevelForRoute(item.checkRoute || item.route);

      const hasItemAccess = hasAccess(accessLevel);
      // console.log(accessLevel, hasItemAccess, hasItemAccess);

      if (hasItemAccess || (item.items && item.items.length > 0)) {
        let newItem = { ...item };

        // Convert route to locale path if route is provided
        if (newItem.route) {
          newItem.route = convertToLocalePath(newItem.route);
        }

        // Filter sub-items if they exist
        if (newItem.items && newItem.items.length > 0) {
          newItem.items = filterNavigationItems(newItem.items);
        }

        // Only add items that themselves or their sub-items have access
        if (hasItemAccess || newItem.items.length > 0) {
          acc.push(newItem);
        }

        // console.log(accessLevel, hasItemAccess, newItem);
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
