import { Message } from '../message.entity';

export interface MessageReceivedSubscriptionPayload {
  messageReceived: Message;
}
