// profileNavigation.ts
export function profileNavigation() {
    const localePath = useLocalePath();

    return {
        route: localePath("/dashboard/profile"),
        items: [
            {
                label: "Account",
                icon: "pi pi-user",
                command: () => {
                    navigateTo(localePath("/dashboard/profile"));
                },
            },
            {
                label: "Actions",
                icon: "pi pi-chart-line",
                command: () => {
                    navigateTo(localePath("/dashboard/profile/actions"));
                },
            },
        ],
    };
}
