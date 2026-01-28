import { isValidHighScore } from "@shared/functions/validate-high-score/index.ts";
import { authenticateSession } from "@shared/middleware/auth.ts";
import { saveScore } from "@shared/services/score.ts";
import {
  badRequest,
  internalServerError,
  jsonResponse,
} from "@shared/utils/response.ts";

/**
 * Handler for saving a high score
 * @param sessionToken Session JWT token from cookies
 * @param requestBody Request body containing high score data
 * @returns Response with saved score or error
 */
export async function handleSaveHighScore(
  sessionToken: string | undefined,
  requestBody: unknown
): Promise<Response> {
  try {
    if (!sessionToken) {
      return badRequest("Missing session cookie");
    }

    const sessionId = await authenticateSession(sessionToken);

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

    const responseHeaders = new Headers();
    responseHeaders.set("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    responseHeaders.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    responseHeaders.set("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type");
    responseHeaders.set("Access-Control-Allow-Credentials", "true");

    // Return success response
    return jsonResponse(
      {
        message: "High score saved",
        data: savedScore,
      },
      201,
      responseHeaders
    );
  } catch (error) {
    // Handle Response objects thrown by authenticateSession
    if (error instanceof Response) {
      return error; // Return the error response
    }
    // Handle parseJsonBody errors (already formatted)
    if (error instanceof Error && error.message.startsWith("Invalid JSON body"))
      return badRequest("Invalid JSON body", error.message);

    const details = error instanceof Error ? error.message : String(error);
    return internalServerError("Failed to save high score", details);
  }
}
