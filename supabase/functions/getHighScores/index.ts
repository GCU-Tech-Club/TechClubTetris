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
		responseHeaders.set("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
		responseHeaders.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
		responseHeaders.set("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type");
        responseHeaders.set("Access-Control-Allow-Credentials", "true");
		return new Response(null, {
			status: 204,
			headers: responseHeaders,
		});
	}
	// Validate request method
	if (!isMethod(req, "GET")) return methodNotAllowed();

	// Extract session JWT from cookies
	const cookies = getCookies(req.headers);
	const sessionToken = cookies.session;

	// Extract page number from query parameters, default to 1
	const url = new URL(req.url);
	const pageParam = url.searchParams.get("page");
	const page = pageParam ? parseInt(pageParam, 10) : 1;

	// Call handler with extracted data
	return await handleGetHighScores(sessionToken, page);
});
