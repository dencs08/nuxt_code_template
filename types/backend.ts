export interface BackendClient {
  //users
  getUsers(): Promise<any[]>;
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
}
