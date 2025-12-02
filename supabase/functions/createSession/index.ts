import { handleCreateSession } from "./handler.ts";
import { isMethod } from "@shared/utils/request.ts";
import { methodNotAllowed } from "@shared/utils/response.ts";
import { serve } from "server";

/**
 * Create Session Edge Function
 * Creates a new game session and returns a JWT token
 */
serve(async (req: Request) => {
	// Validate request method
	if (!isMethod(req, "POST")) return methodNotAllowed();

	// Call handler
	return await handleCreateSession();
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/createSession' \
    --header 'Authorization: Bearer YOUR_ANON_KEY' \
    --header 'Content-Type: application/json' \
    --data '{}'
*/
