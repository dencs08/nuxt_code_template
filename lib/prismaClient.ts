import type { BackendClient } from "../types/backend";

export class PrismaClient implements BackendClient {
  constructor(private client: any) {}

  //users
  async getUsers(): Promise<any[]> {
    return await this.client.users.findMany();
  }
  async getAuthUsers(): Promise<any[]> {
    return;
  }
  async createUser(data: any): Promise<any> {}

  async updateUser(user: any): Promise<any> {}

  async deleteUser(userId: string): Promise<void> {
    await this.client.users.delete({
      where: {
        id: userId,
      },
    });
  }

  //auth
  //TODO: Add a way to retrieve a user from current session (laravel passport)
  async getCurrentUser(userId?: string): Promise<any> {
    if (!userId) {
      throw new Error("User ID is required for PrismaClient");
    }
    return await this.client.users.findUnique({
      where: {
        id: userId,
      },
    });
  }

  //utils
  async assignRole(event: any, body: { id: string; role: string }) {}
  async confirmEmail(event: any) {}

  //me
  async getMe(): Promise<any> {}
  async deleteMe(): Promise<void> {}
  async updateMe(data: any): Promise<any> {}
  async putMe(data: any): Promise<any> {}
}
