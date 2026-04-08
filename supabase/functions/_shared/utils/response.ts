import { applyCorsHeaders } from "./cors.ts";

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
  // If headers is a Headers object, set Content-Type on it
  if (headers instanceof Headers) {
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify(data), {
      status,
      headers,
    });
  }

  // Otherwise merge with Content-Type for plain objects/arrays
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
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
  details?: string | string[] | Record<string, unknown>,
  corsRequest?: Request,
): Response {
  const body: Record<string, unknown> = { error: message };

  if (details !== undefined) body.details = details;

  const responseHeaders = new Headers();
  applyCorsHeaders(responseHeaders, corsRequest ?? null);

  return jsonResponse(body, status, responseHeaders);
}

/**
 * Creates a bad request response with the given message and status code
 * @param message Error message
 * @param details Additional details
 * @returns Response object
 */
export function badRequest(
  message: string,
  details?: string | string[],
  corsRequest?: Request,
): Response {
  return errorResponse(message, 400, details, corsRequest);
}

/**
 * Creates an unauthorized response with the given message and status code
 * @param message Error message
 * @returns Response object
 */
export function unauthorized(
  message: string = "Unauthorized",
  corsRequest?: Request,
): Response {
  return errorResponse(message, 401, undefined, corsRequest);
}

/**
 * Creates a method not allowed response with the given message and status code
 * @param message Error message
 * @returns Response object
 */
export function methodNotAllowed(corsRequest?: Request): Response {
  return errorResponse("Method not allowed", 405, undefined, corsRequest);
}

/**
 * Creates an internal server error response with the given message and status code
 * @param message Error message
 * @param details Additional details
 * @returns Response object
 */
export function internalServerError(
  message: string = "Internal server error",
  details?: string,
  corsRequest?: Request,
): Response {
  return errorResponse(message, 500, details, corsRequest);
}
