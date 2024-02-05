import { validRoles } from "../roles";
import { routeSettings } from "@/routes/routeSettings";
const { hasAccess: originalHasAccess } = useRoleCheck();
const localePath = useLocalePath();

// main-dashboard.ts
export function mainDashboardNavigation() {
    const dashboardRoutes = {
        home: "dash-home",
        inbox: "dash-mail-inbox",
        mail: "dash-mail-inbox",

        user: {},

        admin: {
            users: "dash-admin-users",
            marketing: "dash-admin-marketing",
            analytics: {
                route: "dash-admin-analytics",
                users: "dash-admin-analytics-users",
            },
        },
    };

    const navigation = computed(() => [
        {
            label: "Main",
            icon: "pi pi-home",
            route: dashboardRoutes.home,
        },
        {
            label: "Marketing",
            icon: "pi pi-percentage",
            route: dashboardRoutes.admin.marketing,
            // badge: 5,
        },
        {
            label: "Mail",
            icon: "pi pi-envelope",
            checkRoute: dashboardRoutes.mail,
            items: [
                {
                    label: "Inbox",
                    icon: "pi pi-inbox",
                    route: dashboardRoutes.inbox,
                    badge: 5,
                    // shortcut: "⌘+N",
                },
            ],
        },
        {
            label: "Analytics",
            icon: "pi pi-chart-bar",
            checkRoute: dashboardRoutes.admin.analytics, //for checking if the current route is active
            items: [
                {
                    label: "Users",
                    icon: "pi pi-users",
                    route: dashboardRoutes.admin.analytics.users,
                },
            ],
        },
        {
            label: "Administrative",
            icon: "pi pi-home",
            items: [
                {
                    label: "Users",
                    icon: "pi pi-users",
                    route: dashboardRoutes.admin.users,
                },
            ],
        },
    ]);

    const getAccessLevelForRoute = (input: any): string => {
        // Handle cases where input is an object with a 'route' key
        let routeName = typeof input === "object" && input !== null ? input.route : input;

        // Ensure routeName is a string before proceeding
        if (typeof routeName !== "string") {
            return ""; // Return a default value indicating no specific access
        }

        // First, try to get an explicit setting from routeSettings
        const setting = routeSettings[routeName as keyof typeof routeSettings]?.access;
        if (setting) {
            return setting; // If an explicit setting is found, return it immediately
        }

        // If no explicit setting is found, attempt to determine the access level from the route path
        const pathSegments = routeName.split("-").filter(Boolean); // Remove any empty segments
        const reversedSegments = pathSegments.reverse();

        for (const segment of reversedSegments) {
            const roleMatch = validRoles.find((role) => segment.toLowerCase() === role.value);
            if (roleMatch) {
                return roleMatch.value; // If a matching role is found, return its value as the access level
            }
        }

        return ""; // Default to no specific access level if no matches are found
    };

    const hasAccess = (accessLevel: string) => {
        if (!accessLevel) {
            return true; //if no access level is set, allow access
        }
        return originalHasAccess(accessLevel);
    };

    const filterNavigationItems = (items: any) => {
        return items.reduce((acc: any, item: any) => {
            // Check if the current item or any of its sub-items have access
            const accessLevel = getAccessLevelForRoute(item.checkRoute || item.route);

            const hasItemAccess = hasAccess(accessLevel);

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
            }

            return acc;
        }, []);
    };

    const filteredDashboardNavigation = computed(() => {
        return filterNavigationItems(navigation.value);
    });

    const convertToLocalePath = (routeName: string) => {
        return localePath({ name: routeName });
    };

    return filteredDashboardNavigation;
}
