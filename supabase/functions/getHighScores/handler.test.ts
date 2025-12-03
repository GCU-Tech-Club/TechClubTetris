import { saveScore } from "@shared/services/score.ts";
import { createSession } from "@shared/services/session.ts";
import { resetSupabaseClient } from "@shared/utils/supabase.ts";
import { assertEquals } from "std/assert/mod.ts";
import { handleGetHighScores } from "./handler.ts";

/**
 * Setup: Reset Supabase client before each test
 */
Deno.test("handleGetHighScores - missing session token", async () => {
	resetSupabaseClient();

	const response = await handleGetHighScores(undefined, 1);

	assertEquals(response.status, 400);
	const body = await response.json();
	assertEquals(body.error, "Missing session cookie");
});

/**
 * Tests handler with invalid session token
 */
Deno.test("handleGetHighScores - invalid session token", async () => {
	resetSupabaseClient();

	const response = await handleGetHighScores("invalid.token", 1);

	assertEquals(response.status, 401);
	const body = await response.json();
	assertEquals(body.error, "Invalid token");
});

/**
 * Tests handler with valid request
 */
Deno.test(
	{
		name: "handleGetHighScores - valid request",
		sanitizeResources: false,
		sanitizeOps: false,
	},
	async () => {
		resetSupabaseClient();

		// Create a valid session
		const session = await createSession();

		// Save some test scores
		await saveScore({
			uid: session.sessionId,
			initials: "ABC",
			score: 1000,
		});

		await saveScore({
			uid: session.sessionId,
			initials: "XYZ",
			score: 2000,
		});

		const response = await handleGetHighScores(session.jwt, 1);

		assertEquals(response.status, 200);
		const body = await response.json();
		assertEquals(Array.isArray(body.data), true);
		assertEquals(body.data.length > 0, true);
	},
);
