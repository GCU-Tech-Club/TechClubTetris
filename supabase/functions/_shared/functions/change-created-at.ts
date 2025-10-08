import { Session } from "../types/session.ts";

export const changeCreatedAt = (session: Session): Session => {
  session.created_at = new Date();
  return session;
}