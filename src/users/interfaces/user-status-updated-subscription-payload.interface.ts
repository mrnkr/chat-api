import { User } from '../user.entity';

export interface UserStatusUpdatedSubscriptionPayload {
  userStatusUpdated: User;
}
