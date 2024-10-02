import { z, ZodSchema } from "zod";
import { H3Event, createError } from "h3";
import validator from "validator";

// Recursively sanitize strings in the body, except for specific fields
function sanitizeData(data: any, skipFields: string[] = []): any {
  if (typeof data === "string") {
    return validator.escape(data); // Escape special characters to prevent injection attacks
  } else if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item, skipFields)); // Recursively sanitize arrays
  } else if (typeof data === "object" && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        skipFields.includes(key) ? value : sanitizeData(value, skipFields),
      ])
    );
  }
  return data; // Non-string, non-object, non-array types are returned as is
}

interface ValidateBodyOptions<T> {
  schema: ZodSchema<T>;
  skipFields?: string[];
}

export async function validateBody<T>(
  event: H3Event,
  options: ValidateBodyOptions<T>
): Promise<T> {
  const { schema, skipFields = [] } = options;
  const body = await readBody(event);
  try {
    const validatedBody = schema.parse(body);

    return validatedBody;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation Error:", error.errors);
    }
    throw createError({
      statusCode: 400,
      statusMessage: "Validation failed",
    });
  }
}
