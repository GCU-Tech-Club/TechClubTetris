import { authenticateSession } from "@shared/middleware/auth.ts";
import { getTopScores } from "@shared/services/score.ts";
import { isMethod } from "@shared/utils/request.ts";
import {
	badRequest,
	internalServerError,
	jsonResponse,
	methodNotAllowed,
} from "@shared/utils/response.ts";
import { getCookies } from "cookie";
import { serve } from "server";

/**
 * Save High Score Edge Function
 * Handles GET (retrieve top scores) and POST (save new score) requests
 */
serve(async (req: Request) => {
	// Validate request method
	if (!isMethod(req, "GET")) return methodNotAllowed();

	// Handle GET request - retrieve top 10 high scores
	try {
		// Extract session JWT from cookies
		const cookies = getCookies(req.headers);
		const sessionToken = cookies.session;

		if (!sessionToken) {
			return badRequest("Missing session cookie");
		}

		if (!authenticateSession(sessionToken)) {
			return badRequest("Invalid session");
		}
		const scores = await getTopScores(10);
		return jsonResponse({ data: scores });
	} catch (error) {
		const details = error instanceof Error ? error.message : String(error);
		return internalServerError("Failed to retrieve high scores", details);
	}
});
