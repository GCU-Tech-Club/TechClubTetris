import { assertEquals } from "std/assert/mod.ts";
import {
	authenticateSession,
	validateSessionExists,
} from "./auth.ts";
import { createSession } from "../services/session.ts";
import { createJwtToken } from "../utils/jwt.ts";
import {
	createSupabaseClient,
	resetSupabaseClient,
} from "../utils/supabase.ts";

/**
 * Setup: Reset Supabase client before each test
 */
Deno.test({
	name: "validateSessionExists - valid session",
	sanitizeResources: false,
	sanitizeOps: false,
}, async () => {
	resetSupabaseClient();

	// Create a session
	const session = await createSession();

	// Validate it exists
	const isValid = await validateSessionExists(session.sessionId);
	assertEquals(isValid, true);
});

/**
 * Tests that validateSessionExists returns false for non-existent session
 */
Deno.test({
	name: "validateSessionExists - non-existent session",
	sanitizeResources: false,
	sanitizeOps: false,
}, async () => {
	resetSupabaseClient();

	const fakeSessionId = crypto.randomUUID();
	const isValid = await validateSessionExists(fakeSessionId);
	assertEquals(isValid, false);
});

/**
 * Tests that validateSessionExists returns false for expired session
 */
Deno.test({
	name: "validateSessionExists - expired session",
	sanitizeResources: false,
	sanitizeOps: false,
}, async () => {
	resetSupabaseClient();

	// Create a session
	const session = await createSession();

	// Manually update the session's created_at to be 25 hours ago
	const supabase = createSupabaseClient();

	const expiredDate = new Date();
	expiredDate.setHours(expiredDate.getHours() - 25);

	await supabase
		.from("sessions")
		.update({ created_at: expiredDate.toISOString() })
		.eq("id", session.sessionId);

	// Validate it's expired
	const isValid = await validateSessionExists(session.sessionId);
	assertEquals(isValid, false);
});

/**
 * Tests that authenticateSession works with valid token
 */
Deno.test({
	name: "authenticateSession - valid token",
	sanitizeResources: false,
	sanitizeOps: false,
}, async () => {
	resetSupabaseClient();

	// Create a session
	const session = await createSession();

	// Authenticate with the JWT token
	const sessionId = await authenticateSession(session.jwt);
	assertEquals(sessionId, session.sessionId);
});

/**
 * Tests that authenticateSession throws Response for invalid token
 */
Deno.test({
	name: "authenticateSession - invalid token",
	sanitizeResources: false,
	sanitizeOps: false,
}, async () => {
	resetSupabaseClient();

	try {
		await authenticateSession("invalid.token.here");
		assertEquals(false, true, "Should have thrown Response");
	} catch (error) {
		assertEquals(error instanceof Response, true);
		const response = error as Response;
		assertEquals(response.status, 401);
	}
});

/**
 * Tests that authenticateSession throws Response for expired session
 */
Deno.test({
	name: "authenticateSession - expired session",
	sanitizeResources: false,
	sanitizeOps: false,
}, async () => {
	resetSupabaseClient();

	// Create a session
	const session = await createSession();

	// Manually update the session's created_at to be 25 hours ago
	const supabase = createSupabaseClient();

	const expiredDate = new Date();
	expiredDate.setHours(expiredDate.getHours() - 25);

	await supabase
		.from("sessions")
		.update({ created_at: expiredDate.toISOString() })
		.eq("id", session.sessionId);

	// Authenticate should fail
	try {
		await authenticateSession(session.jwt);
		assertEquals(false, true, "Should have thrown Response");
	} catch (error) {
		assertEquals(error instanceof Response, true);
		const response = error as Response;
		assertEquals(response.status, 401);
	}
});

/**
 * Tests that authenticateSession throws Response for non-existent session
 */
Deno.test({
	name: "authenticateSession - non-existent session",
	sanitizeResources: false,
	sanitizeOps: false,
}, async () => {
	resetSupabaseClient();

	// Create a JWT token for a session that doesn't exist in the database
	const fakeSessionId = crypto.randomUUID();
	const token = await createJwtToken(fakeSessionId);

	// Authenticate should fail
	try {
		await authenticateSession(token);
		assertEquals(false, true, "Should have thrown Response");
	} catch (error) {
		assertEquals(error instanceof Response, true);
		const response = error as Response;
		assertEquals(response.status, 401);
	}
});

