import { assertEquals } from "std/assert/mod.ts";
import { handleCreateSession } from "./handler.ts";
import { resetSupabaseClient } from "@shared/utils/supabase.ts";

/**
 * Setup: Reset Supabase client before each test
 */
Deno.test({
	name: "handleCreateSession - creates session successfully",
	sanitizeResources: false,
	sanitizeOps: false,
}, async () => {
	resetSupabaseClient();

	const response = await handleCreateSession();

	assertEquals(response.status, 201);
	const body = await response.json();
	assertEquals(typeof body.session_id, "string");
	assertEquals(body.session_id.length > 0, true);
	assertEquals(typeof body.created_at, "string");
	assertEquals(body.message, "Game session started successfully with JWT authentication");

	// Check that cookie is set
	const setCookieHeader = response.headers.get("set-cookie");
	assertEquals(setCookieHeader !== null, true);
	assertEquals(setCookieHeader?.includes("session="), true);
});

