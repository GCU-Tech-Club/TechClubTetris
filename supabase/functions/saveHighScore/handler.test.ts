import { assertEquals } from "std/assert/mod.ts";
import { handleSaveHighScore } from "./handler.ts";
import { createSession } from "@shared/services/session.ts";
import { resetSupabaseClient } from "@shared/utils/supabase.ts";

/**
 * Setup: Reset Supabase client before each test
 */
Deno.test("handleSaveHighScore - missing session token", async () => {
	resetSupabaseClient();

	const response = await handleSaveHighScore(undefined, {
		initials: "ABC",
		score: 1000,
	});

	assertEquals(response.status, 400);
	const body = await response.json();
	assertEquals(body.error, "Missing session cookie");
});

/**
 * Tests handler with invalid session token
 */
Deno.test("handleSaveHighScore - invalid session token", async () => {
	resetSupabaseClient();

	const response = await handleSaveHighScore("invalid.token", {
		initials: "ABC",
		score: 1000,
	});

	assertEquals(response.status, 401);
	const body = await response.json();
	assertEquals(body.error, "Invalid token");
});

/**
 * Tests handler with invalid request body
 */
Deno.test({
	name: "handleSaveHighScore - invalid request body",
	sanitizeResources: false,
	sanitizeOps: false,
}, async () => {
	resetSupabaseClient();

	// Create a valid session
	const session = await createSession();

	const response = await handleSaveHighScore(session.jwt, {
		initials: "AB", // Too short
		score: 1000,
	});

	assertEquals(response.status, 400);
	const body = await response.json();
	assertEquals(body.error, "Invalid high score");
});

/**
 * Tests handler with invalid score
 */
Deno.test({
	name: "handleSaveHighScore - invalid score",
	sanitizeResources: false,
	sanitizeOps: false,
}, async () => {
	resetSupabaseClient();

	// Create a valid session
	const session = await createSession();

	const response = await handleSaveHighScore(session.jwt, {
		initials: "ABC",
		score: -100, // Negative score
	});

	assertEquals(response.status, 400);
	const body = await response.json();
	assertEquals(body.error, "Invalid high score");
});

/**
 * Tests handler with valid request
 */
Deno.test({
	name: "handleSaveHighScore - valid request",
	sanitizeResources: false,
	sanitizeOps: false,
}, async () => {
	resetSupabaseClient();

	// Create a valid session
	const session = await createSession();

	const response = await handleSaveHighScore(session.jwt, {
		initials: "ABC",
		score: 1000,
	});

	assertEquals(response.status, 201);
	const body = await response.json();
	assertEquals(body.message, "High score saved");
	assertEquals(body.data.initials, "ABC");
	assertEquals(body.data.score, 1000);
	assertEquals(body.data.uid, session.sessionId);
});

