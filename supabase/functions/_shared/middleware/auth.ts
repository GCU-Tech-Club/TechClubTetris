import { decodeJwtToken, validateJwtClaims } from "../utils/jwt.ts";
import { createSupabaseClient } from "../utils/supabase.ts";

/**
 * Authenticated request interface
 */
export interface AuthenticatedRequest {
  sessionId: string;
}

/**
 * Extracts JWT token from Authorization header
 * @param req Request object
 * @returns JWT token string
 * @throws Error if token is missing or invalid format
 */
function extractToken(req: Request): string {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }

  const token = authHeader.split(" ")[1];
  if (!token) throw new Error("Token not found in Authorization header");

  return token;
}

/**
 * Validates that a session exists in the database
 * @param sessionId Session ID to validate
 * @returns void
 * @throws Error if session doesn't exist
 */
async function validateSessionExists(sessionId: string): Promise<void> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error || !data) throw new Error("Session not found");
}

/**
 * Authenticates a request by extracting and validating JWT token
 * @param req Request object
 * @returns Authenticated request with sessionId
 * @throws Response if authentication fails (to be caught by caller)
 */
export async function authenticateRequest(
  req: Request
): Promise<AuthenticatedRequest> {
  try {
    const token = extractToken(req);
    const claims = decodeJwtToken(token);
    const sessionId = validateJwtClaims(claims);

    // Validate session exists in database
    await validateSessionExists(sessionId);

    return { sessionId };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Return unauthorized response (handled by caller)
    throw new Response(
      JSON.stringify({
        error: "Invalid token",
        details: errorMessage,
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
