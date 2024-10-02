<template>
  <Menubar
    v-if="showMenubar"
    :model="currentSubNavigation"
    class="py-2 !rounded-none"
    breakpoint="225px"
    :pt="{
      root: [
        'p-1',
        '!rounded-none',
        'bg-transparent dark:bg-surface-transparent',
        '!border-b !border-t-0 !border-x-0 border-surface-100/50 dark:border-surface-700/50',
      ],
    }"
  >
    <template #start> </template>
    <template #item="{ item, props, hasSubmenu, root }">
      <NuxtLink
        v-ripple
        class="flex items-center gap-2 !py-1 !px-2.5"
        v-bind="props.action"
      >
        <span :class="item.icon" class="text-muted-color" />
        <span class="text-surface-500/75 dark:text-surface-200/75">{{
          item.label
        }}</span>
        <span
          v-if="item.shortcut"
          class="ml-auto border border-surface-50 rounded bg-emphasis text-muted-color text-xs p-1"
          >{{ item.shortcut }}</span
        >
        <i
          v-if="hasSubmenu"
          :class="[
            'pi pi-angle-down',
            { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root },
          ]"
        ></i>
      </NuxtLink>
    </template>
    <template #end></template>
  </Menubar>
</template>

<script setup>
const route = useRoute();
const { dashboardSubNavigation, dashboardNavigation } = useNavigation();
import { routes } from "~~/config/common/routes";
const { hasAccess } = useRoleCheck();
const localePath = useLocalePath();

const isRouteMatch = (itemRoute, currentPath) => {
  if (Array.isArray(itemRoute)) {
    return itemRoute.some(
      (route) => currentPath === route || currentPath.startsWith(route + "/")
    );
  }
  return currentPath === itemRoute || currentPath.startsWith(itemRoute + "/");
};

const getAccessLevelForRoute = (input) => {
  let routeName =
    typeof input === "object" && input !== null ? input.route : input;
  if (typeof routeName !== "string") {
    return 0; // Default to lowest access level
  }

  const routeMatch = routes.find((route) => route.newName === routeName);
  if (
    routeMatch &&
    routeMatch.settings &&
    typeof routeMatch.settings.access === "number"
  ) {
    return routeMatch.settings.access;
  }

  return 0; // Default to lowest access level
};

const filterNavigationItems = (items) => {
  return items.reduce((acc, item) => {
    const accessLevel = getAccessLevelForRoute(item.checkRoute || item.route);
    const hasItemAccess = hasAccess(accessLevel);

    if (hasItemAccess || (item.items && item.items.length > 0)) {
      let newItem = { ...item };
      if (newItem.route) {
        newItem.route = localePath({ name: newItem.route });
      }
      if (newItem.items && newItem.items.length > 0) {
        newItem.items = filterNavigationItems(newItem.items);
      }
      if (hasItemAccess || newItem.items.length > 0) {
        acc.push(newItem);
      }
    }
    return acc;
  }, []);
};

const currentSubNavigation = computed(() => {
  const searchNavItems = (items, path) => {
    for (const item of items) {
      const itemMatches =
        isRouteMatch(item.route, path) || isRouteMatch(item.checkRoute, path);

      const subItemMatches =
        item.items &&
        item.items.some(
          (subItem) =>
            isRouteMatch(subItem.route, path) ||
            isRouteMatch(subItem.checkRoute, path)
        );

      if (itemMatches || subItemMatches) {
        return item.items && item.items.length > 1
          ? filterNavigationItems(item.items)
          : [];
      }

      if (item.items) {
        const subItems = searchNavItems(item.items, path);
        if (subItems.length > 0) {
          return subItems;
        }
      }
    }
    return [];
  };

  const allItems = [
    ...dashboardNavigation.value,
    ...dashboardSubNavigation.value,
  ];
  return searchNavItems(allItems, route.path);
});

const showMenubar = computed(() => currentSubNavigation.value.length > 1);

// Watch for route changes to update the navigation
watch(
  () => route.path,
  () => {
    // Force re-computation of currentSubNavigation
    currentSubNavigation.value = currentSubNavigation.value;
  }
);
</script>
