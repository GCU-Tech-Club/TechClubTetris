/**
 * Browser origins allowed to call edge functions with credentials.
 * Use the Origin value (scheme + host [+ port]), not a full page URL.
 */
const ALLOWED_ORIGINS = new Set([
  "http://127.0.0.1:5500",
  "https://gcu-tech-club.github.io",
]);

/**
 * Applies CORS headers for preflight and actual responses.
 * When `request` is omitted, only shared headers are set (for non-browser callers).
 */
export function applyCorsHeaders(headers: Headers, request: Request | null): void {
  if (request) {
    const origin = request.headers.get("Origin");
    if (origin && ALLOWED_ORIGINS.has(origin)) {
      headers.set("Access-Control-Allow-Origin", origin);
      headers.set("Access-Control-Allow-Credentials", "true");
    }
  }
  headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  headers.set(
    "Access-Control-Allow-Headers",
    "authorization, x-client-info, apikey, content-type",
  );
}
