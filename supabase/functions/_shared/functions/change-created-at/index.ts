import { Session } from "../../types/session.ts";

/**
 * Changes the created_at timestamp of a session
 * @param session Session to change
 * @returns Session with changed created_at timestamp
 */
export const changeCreatedAt = (session: Session): Session => {
  return {
    ...session,
    created_at: new Date(),
  };
};
