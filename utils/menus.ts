import { profileNavigation } from "./navigations/profileNavigation";
import { settingsNavigation } from "./navigations/settingsNavigation";

export function useNavigation() {
    const localePath = useLocalePath();

    const navigation = computed(() => [{ name: "Kontakt", to: localePath("/contact") }]);

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
            command: () => {
                navigateTo(localePath("/dashboard/home"));
            },
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
            badge: 5,
            items: [
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
                            command: () => {
                                navigateTo(localePath("/dashboard/marketing"));
                            },
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
                    label: "Reports",
                    icon: "pi pi-chart-bar",
                    items: [
                        {
                            label: "test",
                            icon: "pi pi-briefcase",
                            command: () => {
                                navigateTo(localePath("/dashboard/reports/test"));
                            },
                        },
                        {
                            label: "test2",
                            icon: "pi pi-briefcase",
                            command: () => {
                                navigateTo(localePath("/dashboard/reports/test2"));
                            },
                        },
                    ],
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
                    command: () => {
                        navigateTo(localePath("/dashboard/users"));
                    },
                },
            ],
        },
    ]);

    const dashboardSettings = computed(() => [
        {
            label: "Settings",
            icon: "pi pi-cog",
            items: [
                {
                    label: "Some setting..",
                    icon: "pi pi-cog",
                    command: () => {
                        navigateTo(localePath("/dashboard/settings"));
                    },
                },
            ],
        },
    ]);

    const dashboardSubNavigation = ref([profileNavigation(), settingsNavigation()]);

    return {
        navigation,
        legal,
        social,
        dashboardNavigation,
        dashboardSettings,
        dashboardSubNavigation,
    };
}
