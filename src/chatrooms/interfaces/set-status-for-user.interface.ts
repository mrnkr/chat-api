import { UserStatus } from '../user-status.enum';

export interface SetStatusForUser {
  chatroomId: string;
  userId: string;
  status: UserStatus;
}
