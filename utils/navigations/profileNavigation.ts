// profileNavigation.ts
export function profileNavigation() {
    const localePath = useLocalePath();

    return {
        path: "/profile",
        tabMenuItems: [
            {
                label: "Account",
                icon: "pi pi-user",
                route: localePath("/dashboard/profile"),
            },
            {
                label: "Actions",
                icon: "pi pi-chart-line",
                route: localePath("/dashboard/profile/actions"),
            },
        ],
    };
}
