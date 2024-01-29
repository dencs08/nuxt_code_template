// profileNavigation.ts
export function profileNavigation() {
    const localePath = useLocalePath();

    return {
        route: localePath("/dashboard/user/profile"),
        checkRoute: localePath("/dashboard/user/profile"),
        items: [
            {
                label: "Account",
                icon: "pi pi-user",
                command: () => {
                    navigateTo(localePath("/dashboard/user/profile"));
                },
            },
            {
                label: "Actions",
                icon: "pi pi-chart-line",
                command: () => {
                    navigateTo(localePath("/dashboard/user/profile/actions"));
                },
            },
            {
                label: "Actions",
                icon: "pi pi-chart-line",
                command: () => {
                    navigateTo(localePath({ name: "contactiro" }));
                },
            },
        ],
    };
}
