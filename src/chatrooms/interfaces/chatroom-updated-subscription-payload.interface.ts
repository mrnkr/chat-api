import { Chatroom } from '../chatroom.entity';

export interface ChatroomUpdatedSubscriptionPayload {
  chatroomUpdated: Chatroom;
}
