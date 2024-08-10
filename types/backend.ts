export interface BackendClient {
  //users
  getUsers(): Promise<any[]>;
  getUser(userId: string): Promise<any>;
  getAuthUsers(): Promise<any[]>;
  deleteUser(userId: string): Promise<void>;
  createUser(data: any, event: any): Promise<any>;
  updateUser(data: any): Promise<any>;

  //auth
  getCurrentUser(): Promise<any>;

  //me
  getMe(): Promise<any>;
  deleteMe(userSession: any): Promise<any>;
  updateMe(user: any, data: any): Promise<any>;
  putMe(user: any, data: any): Promise<any>;
  updateMeEmail(user: any, body: any): Promise<any>;
  updateMePhoto(userId: any, photoUrl: any): Promise<any>;
  getMePermissions(): Promise<any>;

  //utils
  assignRole(event: any, body: { id: string; role: string }): Promise<any>;
  confirmEmail(event: any): Promise<any>;

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

  //newsletter
  addNewsletterSubscriber(email: string): Promise<any>;
  deleteNewsletterSubscriber(email: string): Promise<any>;
  getNewsletterSubscribers(): Promise<any>;
}
