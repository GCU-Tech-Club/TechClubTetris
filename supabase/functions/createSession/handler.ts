import { createSession as createSessionService } from "@shared/services/session.ts";
import { applyCorsHeaders } from "@shared/utils/cors.ts";
import {
	internalServerError,
	jsonResponse,
} from "@shared/utils/response.ts";
import { setCookie } from "cookie";

/**
 * Handler for creating a new game session
 * @returns Response with session data and JWT cookie or error
 */
export async function handleCreateSession(request?: Request): Promise<Response> {
	try {
		// Create session using service layer
		const session = await createSessionService();

		// Create response headers
		const responseHeaders = new Headers();
		applyCorsHeaders(responseHeaders, request ?? null);

		// Create cookie for response
		setCookie(responseHeaders, {
			name: "session",
			value: session.jwt,
			path: "/",
			sameSite: "None",
			secure: true,
			httpOnly: true,
		});

		// Return session data with JWT
		return jsonResponse(
			{
				session_id: session.sessionId,
				created_at: session.createdAt.toISOString(),
				message: "Game session started successfully with JWT authentication",
			},
			201,
			responseHeaders,
		);
	} catch (error) {
		const details = error instanceof Error ? error.message : String(error);
		return internalServerError("Failed to start game session", details, request);
	}
}

