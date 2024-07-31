export interface BackendClient {
  getUsers(): Promise<any[]>;
  getCurrentUser(): Promise<any>;
}
