import { applyCorsHeaders } from "@shared/utils/cors.ts";
import { isMethod, parseJsonBody } from "@shared/utils/request.ts";
import { methodNotAllowed } from "@shared/utils/response.ts";
import { getCookies } from "cookie";
import { serve } from "server";
import { handleSaveHighScore } from "./handler.ts";

/**
 * Save High Score Edge Function
 * Handles POST (save new score) requests
 */
serve(async (req: Request) => {
	if (req.method === "OPTIONS") {
		const responseHeaders = new Headers();
		applyCorsHeaders(responseHeaders, req);
		return new Response(null, {
			status: 204,
			headers: responseHeaders,
		});
	}
	// Handle POST request - save high score
	if (isMethod(req, "POST")) {
		// Extract session JWT from cookies
		const cookies = getCookies(req.headers);
		const sessionToken = cookies.session;

		// Parse request body
		const requestBody = await parseJsonBody(req);

		// Call handler with extracted data
		return await handleSaveHighScore(sessionToken, requestBody, req);
	}
	// Handle unsupported methods
	return methodNotAllowed(req);
});
