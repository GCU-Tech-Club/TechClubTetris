import assert from "node:assert";
import { changeCreatedAt } from "./change-created-at.ts";
import { Session } from "../types/session.ts";



Deno.test("test changeCreatedAt", () => {
  const session: Session = {
    user_id: "123",
    session_id: "123",
    created_at: new Date(),
  };
  console.log(session);
  const sessionWithChangedCreatedAt = changeCreatedAt(session);
  console.log(sessionWithChangedCreatedAt);
  assert(sessionWithChangedCreatedAt.created_at !== session.created_at);
});
