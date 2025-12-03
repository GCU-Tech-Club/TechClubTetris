import { assertEquals, assertThrows } from "std/assert/mod.ts";
import {
  createJwtToken,
  decodeJwtToken,
  extractSessionIdFromClaims,
} from "./jwt.ts";

/**
 * Tests that decodeJwtToken throws error for invalid tokens
 */
Deno.test("decodeJwtToken - invalid token", () => {
  assertThrows(
    () => decodeJwtToken("invalid.token.here"),
    Error,
    "Invalid token"
  );
});

/**
 * Tests that decodeJwtToken throws error for malformed tokens
 */
Deno.test("decodeJwtToken - malformed token", () => {
  assertThrows(() => decodeJwtToken("not-a-jwt-token"), Error, "Invalid token");
});

/**
 * Tests that extractSessionIdFromClaims extracts session ID correctly
 */
Deno.test("extractSessionIdFromClaims - valid claims", () => {
  const sessionId = crypto.randomUUID();
  const claims = {
    sub: sessionId,
    session_id: sessionId,
  };

  const extracted = extractSessionIdFromClaims(claims);
  assertEquals(extracted, sessionId);
});

/**
 * Tests that extractSessionIdFromClaims throws error for missing sub
 */
Deno.test("extractSessionIdFromClaims - missing sub", () => {
  const claims = {
    session_id: crypto.randomUUID(),
  };

  assertThrows(
    () => extractSessionIdFromClaims(claims),
    Error,
    "Invalid token claims"
  );
});

/**
 * Tests that extractSessionIdFromClaims throws error for missing session_id
 */
Deno.test("extractSessionIdFromClaims - missing session_id", () => {
  const claims = {
    sub: crypto.randomUUID(),
  };

  assertThrows(
    () => extractSessionIdFromClaims(claims),
    Error,
    "Session ID not found in token"
  );
});

/**
 * Tests that createJwtToken creates valid tokens
 */
Deno.test("createJwtToken - creates valid token", async () => {
  const sessionId = crypto.randomUUID();
  const token = await createJwtToken(sessionId);

  // Token should be a non-empty string
  assertEquals(typeof token, "string");
  assertEquals(token.length > 0, true);

  // Token should be decodable
  const claims = decodeJwtToken(token);
  const extractedSessionId = extractSessionIdFromClaims(claims);

  assertEquals(extractedSessionId, sessionId);
});

/**
 * Tests that createJwtToken creates tokens with correct session_id claim
 */
Deno.test("createJwtToken - token contains session_id", async () => {
  const sessionId = crypto.randomUUID();
  const token = await createJwtToken(sessionId);

  const claims = decodeJwtToken(token);
  assertEquals(claims.session_id, sessionId);
  assertEquals(claims.sub, sessionId);
});
