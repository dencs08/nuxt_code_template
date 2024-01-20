// settingsNavigation.ts
export function settingsNavigation() {
    const localePath = useLocalePath();

    return {
        path: "/settings",
        tabMenuItems: [
            {
                label: "General",
                icon: "pi pi-user",
                route: localePath("/dashboard/settings"),
            },
            {
                label: "Notifications",
                icon: "pi pi-chart-line",
                route: localePath("/dashboard/settings/notifications"),
            },
            // {
            //     label: "Plan",
            //     icon: "pi pi-chart-line",
            //     command: () => {
            //         navigateTo(localePath("/dashboard/settings/other"));
            //     },
            // },
            // {
            //     label: "Billing",
            //     icon: "pi pi-chart-line",
            //     command: () => {
            //         navigateTo(localePath("/dashboard/settings/other"));
            //     },
            // },
        ],
    };
}
