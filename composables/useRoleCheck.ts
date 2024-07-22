import { type Role, validRoles } from "@/utils/roles";
import mainConfig from "@/config/common/main";

export function useRoleCheck(
  defaultRoleCheck = mainConfig.GLOBAL_ROUTE_ACCESS
) {
  const { roles } = useRoles();
  const userStore = useUsersStore();

  console.log("role", userStore.userRole);

  //   const response = await useAsyncData(async () => new Promise((resolve) => resolve(usersStore.fetchUsers())));

  // const role = userStore.userRole || defaultRoleCheck;
  const userRole = computed(() =>
    roles.value.find((r) => r.value === userStore.userRole)
  );

  const checkAccess = (requiredRoleValue: Role["value"]): boolean => {
    const userRoleLevel = validRoles.find(
      (r) => r.value === (userStore.userRole || defaultRoleCheck)
    )?.level;
    const requiredRole = validRoles.find((r) => r.value === requiredRoleValue);
    console.log("userRoleLevel", userRoleLevel);
    return requiredRole && userRoleLevel >= requiredRole.level;
  };

  const hasAccess = (roleValue: Role["value"] = defaultRoleCheck): boolean => {
    return checkAccess(roleValue);
  };

  const accessByRole = (
    minimalAccessRoleValue: Role["value"]
  ): Record<Role["value"], boolean> => {
    const accessMap: Record<Role["value"], boolean> = {} as Record<
      Role["value"],
      boolean
    >;
    validRoles.forEach((role) => {
      const minimalAccessRoleLevel = validRoles.find(
        (r) => r.value === minimalAccessRoleValue
      )?.level;
      accessMap[role.value] = role.level >= minimalAccessRoleLevel;
    });
    return accessMap;
  };

  return {
    hasAccess,
    checkAccess,
    accessByRole,
  };
}
