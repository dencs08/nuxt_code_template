import { H3Event } from "h3";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: string[];
}

/**
 * Sends a success response with a consistent format.
 * @param event - The H3Event representing the HTTP request/response.
 * @param data - The data to send in the response.
 * @param statusCode - The HTTP status code (default is 200).
 */
export function sendSuccess<T>(
  event: H3Event,
  data: T,
  statusCode: number = 200
): void {
  event.node.res.statusCode = statusCode;
  event.node.res.setHeader("Content-Type", "application/json");
  event.node.res.end(JSON.stringify({ success: true, data } as ApiResponse<T>));
}

/**
 * Sends an error response with a consistent format.
 * @param event - The H3Event representing the HTTP request/response.
 * @param error - The error message or description.
 * @param statusCode - The HTTP status code (default is 400).
 */
export function sendError(
  event: H3Event,
  error: string | string[],
  statusCode: number = 400
): void {
  event.node.res.statusCode = statusCode;
  event.node.res.setHeader("Content-Type", "application/json");

  const response: ApiResponse<null> = {
    success: false,
    error: Array.isArray(error) ? error.join(", ") : error,
    errors: Array.isArray(error) ? error : [error],
  };

  event.node.res.end(JSON.stringify(response));
}
