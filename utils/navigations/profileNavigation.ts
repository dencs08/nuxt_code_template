// profileNavigation.ts
export function profileNavigation() {
    const localePath = useLocalePath();

    return {
        route: localePath({ name: "dash-user-profile" }),
        items: [
            {
                label: "Account",
                icon: "pi pi-user",
                command: () => {
                    navigateTo(localePath({ name: "dash-user-profile" }));
                },
            },
            {
                label: "Actions",
                icon: "pi pi-chart-line",
                command: () => {
                    navigateTo(localePath("/dashboard/user/profile/actions"));
                },
            },
        ],
    };
}
