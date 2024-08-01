export interface BackendClient {
  //users
  getUsers(): Promise<any[]>;
  getAuthUsers(): Promise<any[]>;
  deleteUser(userId: string): Promise<void>;
  createUser(data: any): Promise<any>;
  updateUser(data: any): Promise<any>;

  //auth
  getCurrentUser(): Promise<any>;

  //me
  getMe(): Promise<any>;
  deleteMe(): Promise<void>;
  updateMe(data: any): Promise<any>;
  putMe(data: any): Promise<any>;
}
