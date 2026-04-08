import { applyCorsHeaders } from "@shared/utils/cors.ts";
import { isMethod } from "@shared/utils/request.ts";
import { methodNotAllowed } from "@shared/utils/response.ts";
import { getCookies } from "cookie";
import { serve } from "server";
import { handleGetHighScores } from "./handler.ts";

/**
 * Get High Scores Edge Function
 * Handles GET (retrieve top scores) requests
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
	// Validate request method
	if (!isMethod(req, "GET")) return methodNotAllowed(req);

	// Extract session JWT from cookies
	const cookies = getCookies(req.headers);
	const sessionToken = cookies.session;

	// Extract page number from query parameters, default to 1
	const url = new URL(req.url);
	const pageParam = url.searchParams.get("page");
	const page = pageParam ? parseInt(pageParam, 10) : 1;

	// Call handler with extracted data
	return await handleGetHighScores(sessionToken, page, req);
});
