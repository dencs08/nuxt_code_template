// settingsNavigation.ts
export function settingsNavigation() {
    const localePath = useLocalePath();

    return {
        route: localePath("/dashboard/settings"),
        checkRoute: localePath("/dashboard/settings"),
        items: [
            {
                label: "General",
                icon: "pi pi-user",
                command: () => {
                    navigateTo(localePath("/dashboard/settings"));
                },
            },
            {
                label: "Notifications",
                icon: "pi pi-chart-line",
                command: () => {
                    navigateTo(localePath("/dashboard/settings/notifications"));
                },
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
