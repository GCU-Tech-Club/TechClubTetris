import { createSupabaseClient } from "../utils/supabase.ts";
import { createJwtToken } from "../utils/jwt.ts";

/**
 * Session creation result
 * @param sessionId Session ID
 * @param jwt JWT token
 * @param createdAt Creation date
 */
export interface SessionCreationResult {
  sessionId: string;
  jwt: string;
  createdAt: Date;
}

/**
 * Creates a new game session
 * Generates a session ID, stores it in the database, and returns a JWT token
 * @returns Session creation result with JWT token
 * @throws Error if session creation fails
 */
export async function createSession(): Promise<SessionCreationResult> {
  const supabase = createSupabaseClient();

  // Generate unique session ID
  const sessionId = crypto.randomUUID();

  // Create session in database
  const { error } = await supabase.from("sessions").insert({
    id: sessionId,
    created_at: new Date(),
  });

  if (error) throw new Error(`Failed to create session: ${error.message}`);

  // Create JWT token for the session
  const jwt = await createJwtToken(sessionId);

  return {
    sessionId,
    jwt,
    createdAt: new Date(),
  };
}
