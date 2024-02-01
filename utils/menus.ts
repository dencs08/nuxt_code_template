import { profileNavigation } from "./navigations/profileNavigation";
import { settingsNavigation } from "./navigations/settingsNavigation";

const localesPath = useLocalePath();

const dashboardRoutes = {
    home: localesPath({ name: "dash-home" }),
    mail: localesPath("/dashboard/mail"),

    admin: {
        users: localesPath("/dashboard/admin/users"),
        marketing: localesPath("/dashboard/admin/marketing"),
        analytics: localesPath("/dashboard/admin/analytics"),
    },

    user: {},
};

export function useNavigation() {
    const localePath = useLocalePath(); //if outside of useNavigation causes error 500 - not sure why...

    const navigation = computed(() => [
        {
            label: "Start",
            route: localePath({ name: "index" }),
        },
        {
            label: "Kontakt",
            route: localePath({ name: "contact" }),
        },
    ]);

    const legal = computed(() => [
        { name: "Polityka prywatności", href: localePath({ name: "privacy" }) },
        { name: "Warunki korzystania", href: localePath({ name: "terms" }) },
        { name: "Polityka ciasteczek", href: localePath({ name: "cookies" }) },
        { name: "Ustawienia ciasteczek", href: localePath({ name: "cookies" }) },
    ]);

    const social = computed(() => [
        {
            name: "Facebook",
            href: "#",
            icon: "ic:round-facebook",
        },
        {
            name: "Instagram",
            href: "#",
            icon: "mdi:instagram",
        },

        {
            name: "LinkedIn",
            href: "#",
            icon: "mdi:linkedin",
        },
    ]);

    const dashboardNavigation = computed(() => [
        {
            label: "Main",
            icon: "pi pi-home",
            route: dashboardRoutes.home,
            access: "user",
            // items: [
            //     {
            //         label: "Dashboard",
            //         icon: "pi pi-eraser",
            //         command: () => {
            //             navigateTo(localePath({ name: "dash-home" }));
            //         },
            //     },
            // ],
        },
        {
            label: "Marketing",
            icon: "pi pi-percentage",
            route: localePath("/dashboard/admin/marketing"),
            access: "admin",
            // badge: 5,
            // items: [

            // ],
        },
        {
            label: "Mail",
            icon: "pi pi-envelope",
            access: "user",
            items: [
                {
                    label: "Compose",
                    icon: "pi pi-file-edit",
                    shortcut: "⌘+N",
                },
                {
                    label: "Inbox",
                    icon: "pi pi-inbox",
                    route: localePath("/dashboard/mail/inbox"),
                    badge: 5,
                },
                {
                    label: "Sent",
                    icon: "pi pi-send",
                    // shortcut: "⌘+S",
                },
                {
                    label: "Trash",
                    icon: "pi pi-trash",
                    // shortcut: "⌘+T",
                },
            ],
        },
        {
            label: "Analytics",
            icon: "pi pi-chart-bar",
            checkRoute: dashboardRoutes.admin.analytics, //for checking if the current route is active
            access: "admin",
            items: [
                {
                    label: "Users",
                    icon: "pi pi-users",
                    command: () => {
                        // navigateTo(localePath("/dashboard/admin/analytics/users"));
                    },
                    items: [
                        {
                            label: "test",
                            icon: "pi pi-users",
                            command: () => {
                                navigateTo(localePath("/dashboard/admin/analytics/users/test"));
                            },
                        },
                    ],
                },
                {
                    label: "Test",
                    icon: "pi pi-users",
                    // route: localePath("/dashboard/admin/analytics/test"),
                    command: () => {
                        navigateTo(localePath("/dashboard/admin/analytics/test"));
                    },
                },
            ],
        },
        {
            label: "Administrative",
            icon: "pi pi-home",
            access: "admin",
            items: [
                {
                    label: "Users",
                    icon: "pi pi-users",
                    route: localePath("/dashboard/admin/users"),
                },
            ],
        },
    ]);

    const dashboardSettings = computed(() => [
        {
            label: "Settings",
            icon: "pi pi-cog",
            route: localePath("/dashboard/settings"),
            // items: [
            //     {
            //         label: "Some setting..",
            //         icon: "pi pi-cog",
            //         command: () => {
            //             navigateTo(localePath("/dashboard/settings"));
            //         },
            //     },
            // ],
        },
    ]);

    const { hasAccess } = useRoleCheck();
    const filterNavigationItems = (items: any[]) => {
        return items.filter((item) => {
            if (item.items) {
                item.items = filterNavigationItems(item.items);
            }
            return !item.access || hasAccess(item.access);
        });
    };

    const filteredDashboardNavigation = computed(() => {
        return filterNavigationItems(dashboardNavigation.value);
    });

    const dashboardSubNavigation = computed(() => [profileNavigation(), settingsNavigation()]);

    return {
        navigation,
        legal,
        social,
        dashboardNavigation: filteredDashboardNavigation,
        dashboardSettings,
        dashboardSubNavigation,
    };
}
