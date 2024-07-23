//use checkRoute property for checking if the current route is active (use checkRoute when you don't want to navigate to the route but just check if it's active and ensure user has the access)
export const dashboardMenu = [
  {
    label: "Main",
    icon: "pi pi-home",
    route: "dash-home",
  },
  {
    label: "Marketing",
    icon: "pi pi-percentage",
    route: "dash-admin-marketing",
    // badge: 5,
  },
  {
    label: "Mail",
    icon: "pi pi-envelope",
    checkRoute: "dash-mail-inbox",
    items: [
      {
        label: "Inbox",
        icon: "pi pi-inbox",
        route: "dash-mail-inbox",
        badge: 5,
        // shortcut: "⌘+N",
      },
    ],
  },
  {
    label: "Analytics",
    icon: "pi pi-chart-bar",
    checkRoute: "dash-admin-analytics",
    items: [
      {
        label: "Users",
        icon: "pi pi-users",
        route: "dash-admin-analytics-users",
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
        route: "dash-admin-users",
      },
    ],
  },
  // ... other dashboard menu items
];
