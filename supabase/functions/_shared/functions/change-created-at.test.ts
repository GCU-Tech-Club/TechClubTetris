import { assertNotEquals } from "std/assert/mod.ts";
import { changeCreatedAt } from "./change-created-at.ts";
import { Session } from "@shared/types/session.ts";

Deno.test("test changeCreatedAt", () => {
  const session: Session = {
    user_id: "123",
    session_id: "123",
    created_at: new Date("2025-01-01 12:00:00 UTC"),
  };
  console.log(session);
  const sessionWithChangedCreatedAt = changeCreatedAt(session);
  console.log(sessionWithChangedCreatedAt);
  assertNotEquals(sessionWithChangedCreatedAt.created_at, session.created_at);
});
