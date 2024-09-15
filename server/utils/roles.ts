export function getAccessLevelByRole(roleValue: string, roles: any[]): number {
  const role = roles.find((r) => r.name === roleValue);
  return role ? role.access_level : 0;
}
