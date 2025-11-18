import { isValidHighScore } from "@shared/functions/validate-high-score/index.ts";
import { authenticateSession } from "@shared/middleware/auth.ts";
import { saveScore } from "@shared/services/score.ts";
import { isMethod, parseJsonBody } from "@shared/utils/request.ts";
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
	// Handle POST request - save high score
	if (isMethod(req, "POST")) {
		try {
			// Extract session JWT from cookies
            const cookies = getCookies(req.headers);
            const sessionToken = cookies.session;

			if (!sessionToken) {
				return badRequest("Missing session cookie");
			}

			const sessionId = await authenticateSession(sessionToken);

			if (!sessionId) {
				return badRequest("Invalid session");
			}

			// Parse request body
			const requestBody = await parseJsonBody(req);

			// Validate high score data
			if (!isValidHighScore(requestBody)) {
				return badRequest("Invalid high score");
			}

			// Type is narrowed by isValidHighScore guard
			const body = requestBody as { initials: string; score: number };

			// Save score using service layer
			const savedScore = await saveScore({
				uid: sessionId,
				initials: body.initials,
				score: body.score,
			});

			// Return success response
			return jsonResponse(
				{
					message: "High score saved",
					data: savedScore,
				},
				201,
			);
		} catch (error) {
			// Handle parseJsonBody errors (already formatted)
			if (
				error instanceof Error &&
				error.message.startsWith("Invalid JSON body")
			)
				return badRequest("Invalid JSON body", error.message);

			const details = error instanceof Error ? error.message : String(error);
			return internalServerError("Failed to save high score", details);
		}
	}
	// Handle unsupported methods
	return methodNotAllowed();
});
