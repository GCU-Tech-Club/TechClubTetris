import { Session } from "@shared/types/session.ts";

export const changeCreatedAt = (session: Session): Session => {
  return {
    ...session,
    created_at: new Date(),
  };
};
