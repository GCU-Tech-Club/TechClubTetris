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

	// Check if session is expired
	const sessionAge = Date.now() - new Date(data.created_at).getTime();
	const maxAge = 24 * 60 * 60 * 1000; // 24 hours

	if (sessionAge > maxAge) {
		return false; // Session expired
	}

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

    const responseHeaders = new Headers();
    responseHeaders.set("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    responseHeaders.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    responseHeaders.set("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type");
    responseHeaders.set("Access-Control-Allow-Credentials", "true");

    // Return unauthorized response (handled by caller)
    throw new Response(
      JSON.stringify({
        error: "Invalid token",
        details: errorMessage,
      }),
      {
        status: 401,
        headers: responseHeaders,
      }
    );
  }
}
