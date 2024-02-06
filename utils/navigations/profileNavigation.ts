// profileNavigation.ts
export function profileNavigation() {
    const localePath = useLocalePath();

    return {
        route: localePath({ name: "dash-user-account" }),
        // items: [
        //     {
        //         label: "Account",
        //         icon: "pi pi-user",
        //         checkRoute: "dash-user-account",
        //         command: () => {
        //             navigateTo(localePath({ name: "dash-user-account" }));
        //         },
        //     },
        // ],
    };
}
