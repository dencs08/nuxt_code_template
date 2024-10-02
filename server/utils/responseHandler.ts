import { H3Event } from "h3";

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export class ResponseHandler {
  static success<T>(data: T, statusCode: number = 200): ApiResponse<T> {
    return {
      success: true,
      data,
    };
  }
}
