import { getTopScores } from "@shared/services/score.ts";
import { isMethod} from "@shared/utils/request.ts";
import {
	internalServerError,
	jsonResponse,
	methodNotAllowed,
} from "@shared/utils/response.ts";
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
		const scores = await getTopScores(10);
		return jsonResponse({ data: scores });
	} catch (error) {
		const details = error instanceof Error ? error.message : String(error);
		return internalServerError("Failed to retrieve high scores", details);
	}
});
