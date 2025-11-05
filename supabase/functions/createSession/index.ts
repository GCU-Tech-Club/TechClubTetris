import { serve } from "server";
import { createClient } from "supabase";
import { create, getNumericDate, Header, Payload } from "djwt";

serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!; // Uses service role key for database operations and JWT minting

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return new Response(
      JSON.stringify({
        error: "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  // Validate request method
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Generate unique session ID
  const sessionId = crypto.randomUUID();

  try {
    // Create session in database
    const { error } = await supabase.from("sessions").insert({
      id: sessionId,
      created_at: new Date(),
    });

    if (error) throw error;

    // Mint custom JWT for session ID using djwt
    // Get JWT secret from environment (use Supabase's JWT secret if available)
    const jwtSecretString =
      Deno.env.get("JWT_SECRET") ||
      Deno.env.get("SUPABASE_JWT_SECRET") ||
      "super-secret-jwt-token-with-at-least-32-characters-long";

    if (!jwtSecretString || jwtSecretString.length < 32) {
      throw new Error("JWT_SECRET must be at least 32 characters long");
    }

    // Convert secret string to CryptoKey for HS256 algorithm
    const encoder = new TextEncoder();
    const keyData = encoder.encode(jwtSecretString);
    const jwtSecret = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    // Define JWT header
    const header: Header = {
      alg: "HS256",
      typ: "JWT",
    };

    // Define JWT payload with Supabase-compatible format
    const payload: Payload = {
      iss: "supabase", // issuer
      sub: sessionId, // subject (session ID as uid)
      aud: "authenticated", // audience
      exp: getNumericDate(60 * 60 * 24), // expires in 24 hours (in seconds)
      iat: getNumericDate(new Date()), // issued at
      role: "authenticated", // role
      session_id: sessionId, // custom claim for easy session lookup
    };

    // Create and sign JWT
    const jwt = await create(header, payload, jwtSecret);

    // Return session data with JWT
    return new Response(
      JSON.stringify({
        jwt: jwt,
        session_id: sessionId,
        created_at: new Date().toISOString(),
        message: "Game session started successfully with JWT authentication",
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        error: "Failed to start game session",
        details,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
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
