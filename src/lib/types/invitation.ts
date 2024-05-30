import type { UserPublic } from "./user";

export type InvitationPublic = {
  id: string;
  userId: string;
  user: UserPublic;
};
