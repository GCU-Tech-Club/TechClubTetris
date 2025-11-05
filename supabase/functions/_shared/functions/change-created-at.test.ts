import { assertNotEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { changeCreatedAt } from "./change-created-at.ts";
import { Session } from "../types/session.ts";

Deno.test("test changeCreatedAt", () => {
  const session: Session = {
    id: crypto.randomUUID(),
    created_at: new Date(),
  };
  console.log(session);
  const sessionWithChangedCreatedAt = changeCreatedAt(session);
  console.log(sessionWithChangedCreatedAt);
  assertNotEquals(sessionWithChangedCreatedAt.created_at, session.created_at);
});
