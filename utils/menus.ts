import { profileNavigation } from "./navigations/profileNavigation";
import { settingsNavigation } from "./navigations/settingsNavigation";

const localePath = useLocalePath();

const dashboardRoutes = {
    home: localePath("/dashboard/home"),
    mail: localePath("/dashboard/mail"),

    admin: {
        users: localePath("/dashboard/admin/users"),
        marketing: localePath("/dashboard/admin/marketing"),
        analytics: localePath("/dashboard/admin/analytics"),
    },

    user: {},
};

export function useNavigation() {
    const navigation = computed(() => [
        {
            label: "Start",
            route: localePath("index"),
        },
        {
            label: "Kontakt",
            route: localePath("/contact"),
        },
    ]);

    const legal = computed(() => [
        { name: "Polityka prywatności", href: localePath("/privacy-policy") },
        { name: "Warunki korzystania", href: localePath("/terms-and-conditions") },
        { name: "Polityka ciasteczek", href: localePath("/cookies-policy") },
        { name: "Ustawienia ciasteczek", href: localePath("/contact") },
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
            // items: [
            //     {
            //         label: "Dashboard",
            //         icon: "pi pi-eraser",
            //         command: () => {
            //             navigateTo(localePath("/dashboard/home"));
            //         },
            //     },
            // ],
        },
        {
            label: "Marketing",
            icon: "pi pi-percentage",
            route: localePath("/dashboard/admin/marketing"),
            // badge: 5,
            // items: [

            // ],
        },
        {
            label: "Mail",
            icon: "pi pi-envelope",
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

    const dashboardSubNavigation = computed(() => [profileNavigation(), settingsNavigation()]);

    return {
        navigation,
        legal,
        social,
        dashboardNavigation,
        dashboardSettings,
        dashboardSubNavigation,
    };
}
