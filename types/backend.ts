import type { PaginationParams } from "~~/types/pagination";

export interface BackendClient {
  //users
  getUsers(params: PaginationParams): Promise<any[]>;
  getUser(userId: string): Promise<any>;
  getAuthUsers(params: PaginationParams): Promise<any[]>;
  deleteUser(userId: string): Promise<void>;
  createUser(data: any, event: any, userSession: any): Promise<any>;
  updateUser(data: any): Promise<any>;
  banUser(id: string, duration: string): Promise<any>;
  sendResetPassword(email: string): Promise<any>;
  changeUserPassword(userId: string, password: string): Promise<any>;

  //auth
  getSession(): Promise<any>;
  getCurrentUser(): Promise<any>;
  verifyOtp(otp: string, email: string, type: string): Promise<any>;
  inviteByEmail(email: string, userSession: any): Promise<any>;

  //me
  getMe(): Promise<any>;
  deleteMe(userSession: any): Promise<any>;
  updateMe(user: any, data: any): Promise<any>;
  putMe(user: any, data: any): Promise<any>;
  updateMePhoto(userId: any, photoUrl: any): Promise<any>;
  getMePermissions(userId: string): Promise<any>;
  updatePassword(user: any, password: string): Promise<any>;

  //utils
  assignRole(userId: any, roleId: string, userSession: any): Promise<any>;
  // confirmEmail(event: any): Promise<any>;

  //storage
  uploadFile(
    bucketName: string,
    filePath: string,
    file: string,
    contentType: string,
    upsert: boolean
  ): Promise<any>;
  deleteFile(bucketName: string, filePath: string): Promise<any>;

  //permissions
  getPermissions(userId: string): Promise<any>;
  getAvailablePermissions(): Promise<any>;
  updatePermissions(userId: string, permissions: any): Promise<any>;

  //roles
  getRoles(): Promise<any>;
  getRolePermissions(roleId: number): Promise<any>;
  addRolePermission(roleId: number, permissionId: number): Promise<any>;
  removeRolePermission(roleId: number, permissionId: number): Promise<any>;
  getUserPermissions(userId: string): Promise<any>;
  getUserRole(userId: string): Promise<any>;
  updateRole(roleId: number, accessLevel: number): Promise<void>;
  getRoleById(roleId: number): Promise<any>;

  //newsletter
  addNewsletterSubscriber(email: string): Promise<any>;
  deleteNewsletterSubscriber(email: string): Promise<any>;
  getNewsletterSubscribers(params: PaginationParams): Promise<any>;

  //analytics
  getNewSignupsCount(periodStart: string): Promise<number>;
  getPreviousNewSignupsCount(
    previousPeriodStart: string,
    currentPeriodStart: string
  ): Promise<number>;
  getTotalUsersCount(): Promise<number>;
  getTotalUsersCountBeforeDate(date: string): Promise<number>;
  getPageViewsCount(periodStart: string): Promise<number>;
  getPreviousPageViewsCount(
    previousPeriodStart: string,
    currentPeriodStart: string
  ): Promise<number>;
  getUniqueVisitorsCount(periodStart: string): Promise<number>;
  getPreviousUniqueVisitorsCount(
    previousPeriodStart: string,
    currentPeriodStart: string
  ): Promise<number>;
  insertPageView(data: any): Promise<void>;
}
