import { H3Event } from "h3";
import { ResponseHandler, ApiResponse } from "./responseHandler";

type ApiHandler<T> = (event: H3Event) => Promise<T>;
export function defineApiHandler<T>(handler: ApiHandler<T>) {
  return async (event: H3Event): Promise<ApiResponse<T>> => {
    try {
      const result = await handler(event);
      return ResponseHandler.success(result);
    } catch (error: any) {
      throw error;
    }
  };
}
