import { Mutation, Resolver, Args, Subscription, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { Chatroom } from './chatroom.entity';
import { ChatroomsService } from './chatrooms.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { Message } from './message.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageReceivedSubscriptionVariables } from './interfaces/message-received-subscription-variables.interface';
import { SubscriptionContext } from '../common/interfaces/subscription-context.interface';
import { ChatroomUpdatedSubscriptionPayload } from './interfaces/chatroom-updated-subscription-payload.interface';
import { MessageReceivedSubscriptionPayload } from './interfaces/message-received-subscription-payload.interface';

@Resolver((of) => Chatroom)
export class ChatroomsResolver {
  constructor(
    private readonly chatroomsService: ChatroomsService,
    private readonly pubSub: PubSub,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query((returns) => Chatroom)
  async chatroom(
    @Args('id') chatroomId: string,
    @CurrentUser() currentUser: User,
  ): Promise<Chatroom> {
    const chatroom = await this.chatroomsService.getChatroomById(
      chatroomId,
      currentUser.id,
    );
    return chatroom;
  }

  @UseGuards(GqlAuthGuard)
  @Query((returns) => [Chatroom])
  async chatrooms(@CurrentUser() currentUser: User): Promise<Chatroom[]> {
    const chatrooms = await this.chatroomsService.getChatroomsForUser(
      currentUser.id,
    );
    return chatrooms;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => Chatroom)
  async createChatroom(
    @Args('input') { userId }: CreateChatroomDto,
    @CurrentUser() currentUser: User,
  ): Promise<Chatroom> {
    const chatroom = await this.chatroomsService.createChatroom([
      userId,
      currentUser.id,
    ]);

    this.pubSub.publish('chatroomUpdated', { chatroomUpdated: chatroom });

    return chatroom;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => Message)
  async sendMessage(
    @Args('input') input: SendMessageDto,
    @CurrentUser() currentUser: User,
  ): Promise<Message> {
    const [message, chatroom] =
      await this.chatroomsService.sendMessageToChatroom({
        chatroomId: input.chatroomId,
        messageBody: input.messageBody,
        senderId: currentUser.id,
      });

    this.pubSub.publish('chatroomUpdated', { chatroomUpdated: chatroom });
    this.pubSub.publish('messageReceived', { messageReceived: message });

    return message;
  }

  @Subscription((returns) => Chatroom, {
    filter: (
      payload: ChatroomUpdatedSubscriptionPayload,
      _,
      context: SubscriptionContext,
    ) => {
      const chatroom = payload.chatroomUpdated;
      return chatroom.users.some((u) => u.id === context.currentUser);
    },
  })
  chatroomUpdated() {
    return this.pubSub.asyncIterator('chatroomUpdated');
  }

  @Subscription((returns) => Message, {
    filter: (
      payload: MessageReceivedSubscriptionPayload,
      variables: MessageReceivedSubscriptionVariables,
      context: SubscriptionContext,
    ) => {
      const message = payload.messageReceived;
      const chatroom = message.chatroom as Chatroom;

      return (
        chatroom.id === variables.chatroomId &&
        chatroom.users.some((u) => u.id === context.currentUser) &&
        (message.sender as any) !== context.currentUser
      );
    },
  })
  messageReceived(@Args('chatroomId') chatroomId: string) {
    return this.pubSub.asyncIterator('messageReceived');
  }
}
