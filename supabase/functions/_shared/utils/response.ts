/**
 * JSON response headers
 * @type {HeadersInit}
 */
const JSON_HEADERS: HeadersInit = { "Content-Type": "application/json" };

/**
 * Creates a JSON response with the given data and status code
 * @param data Data to send in the response
 * @param status Status code
 * @param headers Additional headers
 * @returns Response object
 */
export function jsonResponse(
  data: unknown,
  status: number = 200,
  headers: HeadersInit = {}
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...headers },
  });
}

/**
 * Creates an error response with the given message and status code
 * @param message Error message
 * @param status Status code
 * @param details Additional details
 * @returns Response object
 */
export function errorResponse(
  message: string,
  status: number = 500,
  details?: string | string[] | Record<string, unknown>
): Response {
  const body: Record<string, unknown> = { error: message };

  if (details !== undefined) body.details = details;

  return jsonResponse(body, status);
}

/**
 * Creates a bad request response with the given message and status code
 * @param message Error message
 * @param details Additional details
 * @returns Response object
 */
export function badRequest(
  message: string,
  details?: string | string[]
): Response {
  return errorResponse(message, 400, details);
}

/**
 * Creates an unauthorized response with the given message and status code
 * @param message Error message
 * @returns Response object
 */
export function unauthorized(message: string = "Unauthorized"): Response {
  return errorResponse(message, 401);
}

/**
 * Creates a method not allowed response with the given message and status code
 * @param message Error message
 * @returns Response object
 */
export function methodNotAllowed(): Response {
  return errorResponse("Method not allowed", 405);
}

/**
 * Creates an internal server error response with the given message and status code
 * @param message Error message
 * @param details Additional details
 * @returns Response object
 */
export function internalServerError(
  message: string = "Internal server error",
  details?: string
): Response {
  return errorResponse(message, 500, details);
}
