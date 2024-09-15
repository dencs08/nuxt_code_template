//use checkRoute property for checking if the current route is active (use checkRoute when you don't want to navigate to the route but just check if it's active and ensure user has the access)
const localePath = useLocalePath();
export const dashboardMenu = [
  {
    label: "Main",
    icon: "pi pi-home",
    route: "dash-home",
  },
  {
    label: "Marketing",
    icon: "pi pi-megaphone",
    items: [
      {
        label: "Newsletter",
        icon: "pi pi-envelope",
        route: "dash-admin-marketing-newsletter",
        command: () => {
          navigateTo(localePath({ name: "dash-admin-marketing-newsletter" }));
        },
      },
    ],
  },
  {
    label: "Mail",
    icon: "pi pi-envelope",
    checkRoute: "dash-mail-inbox",
    items: [
      {
        label: "Templates",
        icon: "pi pi-inbox",
        route: "dash-mail-templates",
        // badge: 5,
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
    checkRoute: ["/dashboard/admin/roles", "/dashboard/admin/users"],
    items: [
      {
        label: "Users",
        icon: "pi pi-users",
        route: "dash-admin-users",
        command: () => {
          navigateTo(localePath({ name: "dash-admin-users" }));
        },
      },
      {
        label: "Roles",
        icon: "pi pi-key",
        route: "dash-admin-roles",
        command: () => {
          navigateTo(localePath({ name: "dash-admin-roles" }));
        },
      },
    ],
  },
];
