import { decodeJwtToken, extractSessionIdFromClaims } from "../utils/jwt.ts";
import { createSupabaseClient } from "../utils/supabase.ts";

/**
 * Authenticated request interface
 */
export interface AuthenticatedRequest {
  sessionId: string;
}

/**
 * Validates that a session exists in the database
 * @param sessionId Session ID to validate
 * @returns void
 * @throws Error if session doesn't exist
 */
export async function validateSessionExists(
  sessionId: string
): Promise<boolean> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error || !data) return false;

  return true;
}

/**
 * Authenticates a request by extracting and validating JWT token
 * @param req Request object
 * @returns Session ID
 * @throws Response if authentication fails (to be caught by caller)
 */
export async function authenticateSession(
  sessionToken: string
): Promise<string> {
  try {
    const claims = decodeJwtToken(sessionToken);
    const sessionId = extractSessionIdFromClaims(claims);

    // Validate session exists in database
    const isValid = await validateSessionExists(sessionId);

    if (!isValid) throw new Error("Session not found");

    return sessionId;
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
