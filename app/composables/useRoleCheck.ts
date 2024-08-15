import type { Role } from "../../types/roles";
import { validRoles } from "@/utils/roles";
import mainConfig from "../../config/common/main";

export function useRoleCheck(
  defaultAccessLevel: number = mainConfig.GLOBAL_ROUTE_ACCESS
) {
  const userStore = useUserStore();

  const checkAccess = (requiredAccessLevel: number): boolean => {
    const userAccessLevel = getUserAccessLevel();
    return userAccessLevel >= requiredAccessLevel;
  };

  const hasAccess = (accessLevel: number = defaultAccessLevel): boolean => {
    return checkAccess(accessLevel);
  };

  const getUserAccessLevel = (): number => {
    const userRole = userStore.userRole;
    return getAccessLevelByRole(userRole);
  };

  return {
    hasAccess,
    checkAccess,
    getUserAccessLevel,
  };
}

export function getAccessLevelByRole(roleValue: string): number {
  const role = validRoles.find((r) => r.value === roleValue);
  return role ? role.access_level : 0;
}
