import type { RoutesNamesList } from "@typed-router/__routes";
import { profileNavigation } from "@/utils/navigations/profileNavigation";
import { settingsNavigation } from "@/utils/navigations/settingsNavigation";
import { mainDashboardNavigation } from "@/utils/navigations/main-dashboard";
import { navbar, social, legal } from "~~/config/common/menus";

export function useNavigation() {
  const localePath = useLocalePath();

  const navbarMenu = computed(() =>
    navbar.map((item) => ({
      label: item.label,
      route: localePath({ name: item.routeName as RoutesNamesList }),
    }))
  );

  const legalMenu = computed(() =>
    legal.map((item) => ({
      label: item.label,
      route: localePath({ name: item.routeName as RoutesNamesList }),
    }))
  );

  const socialMenu = computed(() =>
    social.map((item) => ({
      label: item.label,
      href: item.href,
      icon: item.icon,
    }))
  );

  const dashboardSettings = computed(() => [
    {
      label: "Settings",
      icon: "pi pi-cog",
      route: localePath("/dashboard/settings"),
    },
  ]);

  const dashboardSubNavigation = computed(() => [
    profileNavigation(),
    settingsNavigation(),
  ]);

  const dashboardNavigation = mainDashboardNavigation();

  return {
    navbarMenu,
    legalMenu,
    socialMenu,
    dashboardNavigation,
    dashboardSettings,
    dashboardSubNavigation,
  };
}
