import { authenticateSession } from "@shared/middleware/auth.ts";
import { getTopScores } from "@shared/services/score.ts";
import {
  badRequest,
  internalServerError,
  jsonResponse,
} from "@shared/utils/response.ts";

/**
 * Handler for retrieving top high scores
 * @param sessionToken Session JWT token from cookies
 * @returns Response with top scores or error
 */
export async function handleGetHighScores(
  sessionToken: string | undefined,
  page: number
): Promise<Response> {
  try {
    if (!sessionToken) {
      return badRequest("Missing session cookie");
    }

    await authenticateSession(sessionToken);

    const from = (page - 1) * 10;
    const to = from + 9;
    const scores = await getTopScores(from, to);

    const responseHeaders = new Headers();
    responseHeaders.set("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    responseHeaders.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    responseHeaders.set("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type");
    responseHeaders.set("Access-Control-Allow-Credentials", "true");

    return jsonResponse({ data: scores }, 200, responseHeaders);
  } catch (error) {
    // Handle Response objects thrown by authenticateSession
    if (error instanceof Response) {
      return error; // Return the error response
    }
    const details = error instanceof Error ? error.message : String(error);
    return internalServerError("Failed to retrieve high scores", details);
  }
}
