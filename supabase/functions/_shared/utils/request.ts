/**
 * Request parsing utilities
 * @param req Request object
 * @returns Parsed JSON object
 * @throws Error if JSON parsing fails
 */
export async function parseJsonBody<T = unknown>(req: Request): Promise<T> {
  try {
    const body = await req.json();
    return body as T;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Invalid JSON body: ${errorMessage}`);
  }
}

/**
 * Validates that the request method is one of the allowed methods
 * @param req Request object
 * @param allowedMethods Array of allowed HTTP methods
 * @returns true if method is allowed, false otherwise
 */
export function validateMethod(
  req: Request,
  allowedMethods: string[]
): boolean {
  return allowedMethods.includes(req.method);
}

/**
 * Validates that the request method matches the expected method
 * @param req Request object
 * @param expectedMethod Expected HTTP method
 * @returns true if method matches, false otherwise
 */
export function isMethod(req: Request, expectedMethod: string): boolean {
  return req.method === expectedMethod;
}
