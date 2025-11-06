import { assertNotEquals } from "std/assert/mod.ts";
import { changeCreatedAt } from "./index.ts";
import { Session } from "../../types/session.ts";

/**
 * Tests that the created_at timestamp of a session is updated
 */
Deno.test("should update session created_at timestamp", async () => {
  const session: Session = {
    id: crypto.randomUUID(),
    created_at: new Date(),
  };
  // Small delay to ensure timestamps are different
  await new Promise((resolve) => setTimeout(resolve, 1));

  const sessionWithChangedCreatedAt = changeCreatedAt(session);
  assertNotEquals(sessionWithChangedCreatedAt.created_at, session.created_at);
});
