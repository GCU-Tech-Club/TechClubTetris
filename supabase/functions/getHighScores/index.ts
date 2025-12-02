import { handleGetHighScores } from "./handler.ts";
import { isMethod } from "@shared/utils/request.ts";
import { methodNotAllowed } from "@shared/utils/response.ts";
import { getCookies } from "cookie";
import { serve } from "server";

/**
 * Get High Scores Edge Function
 * Handles GET (retrieve top scores) requests
 */
serve(async (req: Request) => {
	// Validate request method
	if (!isMethod(req, "GET")) return methodNotAllowed();

	// Extract session JWT from cookies
	const cookies = getCookies(req.headers);
	const sessionToken = cookies.session;

	// Call handler with extracted data
	return await handleGetHighScores(sessionToken);
});
