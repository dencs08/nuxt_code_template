// settingsNavigation.ts
export function settingsNavigation() {
    const localePath = useLocalePath();

    return {
        path: "/settings",
        tabMenuItems: [
            {
                label: "Account",
                icon: "pi pi-user",
                command: () => {
                    navigateTo(localePath("/dashboard/settings"));
                },
            },
            {
                label: "Other settings",
                icon: "pi pi-chart-line",
                command: () => {
                    navigateTo(localePath("/dashboard/settings/other"));
                },
            },
        ],
    };
}
