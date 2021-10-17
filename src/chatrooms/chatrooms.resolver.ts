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
import { LogLastActivityForUserDto } from './dto/log-last-activity-for-user.dto';
import { ChatroomUpdatedSubscriptionVariables } from '../chatrooms/interfaces/chatroom-updated-subscription-variables.interface';

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

    await this.pubSub.publish('chatroomUpdated', { chatroomUpdated: chatroom });

    return chatroom;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => Chatroom)
  async logLastActivityForUser(
    @Args('input') input: LogLastActivityForUserDto,
    @CurrentUser() currentUser: User,
  ): Promise<Chatroom> {
    const chatroom = await this.chatroomsService.logLastActivityForUser({
      chatroomId: input.chatroomId,
      userId: currentUser.id,
    });

    await this.pubSub.publish('chatroomUpdated', { chatroomUpdated: chatroom });

    return chatroom;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => Message)
  async sendMessage(
    @Args('input') input: SendMessageDto,
    @CurrentUser() currentUser: User,
  ): Promise<Message> {
    const chatroom = await this.chatroomsService.sendMessageToChatroom({
      chatroomId: input.chatroomId,
      messageBody: input.messageBody,
      senderId: currentUser.id,
    });

    await this.pubSub.publish('chatroomUpdated', { chatroomUpdated: chatroom });
    await this.pubSub.publish('messageReceived', {
      messageReceived: chatroom.lastMessage,
    });

    return chatroom.lastMessage;
  }

  @Subscription((returns) => Chatroom, {
    filter: (
      payload: ChatroomUpdatedSubscriptionPayload,
      variables: ChatroomUpdatedSubscriptionVariables,
      context: SubscriptionContext,
    ) => {
      const chatroom = payload.chatroomUpdated;
      variables.id ??= chatroom.id;
      return (
        variables.id === chatroom.id && chatroom.canAccess(context.currentUser)
      );
    },
  })
  chatroomUpdated(@Args('id', { nullable: true }) chatroomId?: string) {
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
        chatroom.id === variables.id && chatroom.canAccess(context.currentUser)
      );
    },
  })
  messageReceived(@Args('id') chatroomId: string) {
    return this.pubSub.asyncIterator('messageReceived');
  }
}
