import type { BackendClient } from "../types/backend";

export class PrismaClient implements BackendClient {
  constructor(private client: any) {}

  async getUsers(): Promise<any[]> {
    return await this.client.users.findMany();
  }

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
}
