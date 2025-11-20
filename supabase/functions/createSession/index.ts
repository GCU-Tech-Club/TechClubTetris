import { serve } from "server";
import { createSession as createSessionService } from "@shared/services/session.ts";
import { isMethod } from "@shared/utils/request.ts";
import {
  methodNotAllowed,
  jsonResponse,
  internalServerError,
} from "@shared/utils/response.ts";
import { setCookie } from "cookie";

/**
 * Create Session Edge Function
 * Creates a new game session and returns a JWT token
 */
serve(async (req: Request) => {
  // Validate request method
  if (!isMethod(req, "POST")) return methodNotAllowed();

  try {
    // Create session using service layer
    const session = await createSessionService();

    // Create response headers
    const responseHeaders = new Headers();

    // Create cookie for response
    setCookie(responseHeaders, {
      name: "session",
      value: session.jwt,
      path: "/",
      sameSite: "Strict",
      secure: true,
      httpOnly: true,
    })

    // Return session data with JWT
    return jsonResponse(
      {
        session_id: session.sessionId,
        created_at: session.createdAt.toISOString(),
        message: "Game session started successfully with JWT authentication",
      },
      201,
      responseHeaders,
    );
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    return internalServerError("Failed to start game session", details);
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/createSession' \
    --header 'Authorization: Bearer YOUR_ANON_KEY' \
    --header 'Content-Type: application/json' \
    --data '{}'
*/
