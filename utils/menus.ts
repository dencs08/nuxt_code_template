import { profileNavigation } from "./navigations/profileNavigation";
import { settingsNavigation } from "./navigations/settingsNavigation";
import { mainDashboardNavigation } from "./navigations/main-dashboard";

export function useNavigation() {
    const localePath = useLocalePath(); //if outside of useNavigation causes error 500 - not sure why...

    const navigation = computed(() => [
        {
            label: "Home",
            route: localePath({ name: "index" }),
        },
        {
            label: "Kontakt",
            route: localePath({ name: "contact" }),
        },
        {
            label: "FAQ",
            route: localePath({ name: "faq" }),
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

    const dashboardSettings = computed(() => [
        {
            label: "Settings",
            icon: "pi pi-cog",
            route: localePath("/dashboard/settings"),
        },
    ]);

    const dashboardSubNavigation = computed(() => [profileNavigation(), settingsNavigation()]);

    const dashboardNavigation = mainDashboardNavigation();

    return {
        navigation,
        legal,
        social,
        dashboardNavigation,
        dashboardSettings,
        dashboardSubNavigation,
    };
}
