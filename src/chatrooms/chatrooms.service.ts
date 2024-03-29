import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { User } from '../users/user.entity';
import { Chatroom } from './chatroom.entity';
import { Message } from './message.entity';
import { SendMessage } from './interfaces/send-message.interface';
import { LogLastActivityForUser } from './interfaces/log-last-activity-for-user.interface';

@Injectable()
export class ChatroomsService {
  constructor(
    @InjectModel(Chatroom)
    private readonly ChatroomModel: ModelType<Chatroom>,
    @InjectModel(User)
    private readonly UserModel: ModelType<User>,
  ) {}

  async createChatroom(userIds: string[]): Promise<Chatroom> {
    await this.assertUsersExist(userIds);
    let chatroom = new this.ChatroomModel({
      users: userIds,
    });
    chatroom = await chatroom.save();
    return chatroom;
  }

  async addUserToChatroom(
    chatroomId: string,
    userId: string,
    currentUser: User,
  ): Promise<Chatroom> {
    await this.assertUsersExist([userId]);
    let chatroom = await this.ChatroomModel.findOne({
      _id: chatroomId,
      $and: [{ users: currentUser.id }, { users: { $ne: userId } }],
    } as any);
    chatroom.addToChatroom(userId);
    chatroom = await chatroom.save();
    return chatroom;
  }

  private async assertUsersExist(userIds: string[]): Promise<void> {
    await Promise.all(
      userIds.map(async (id) => {
        const user = await this.UserModel.findById(id);
        if (!user) {
          throw new NotFoundException(`User with Id=${id} could not be found`);
        }
      }),
    );
  }

  async getChatroomsForUser(userId: string): Promise<Chatroom[]> {
    const chatrooms = await this.ChatroomModel.find({
      users: userId,
    } as any).sort({ updatedAt: -1 });
    return chatrooms;
  }

  async getChatroomById(chatroomId: string, userId: string): Promise<Chatroom> {
    const chatroom = await this.ChatroomModel.findOne({
      _id: chatroomId,
      users: userId,
    } as any);
    if (!chatroom) {
      throw new NotFoundException(`Chatroom with id=${chatroomId} not found`);
    }
    return chatroom;
  }

  async sendMessageToChatroom(data: SendMessage): Promise<Chatroom> {
    let chatroom = await this.ChatroomModel.findOne({
      _id: data.chatroomId,
      users: data.senderId,
    } as any);

    if (!chatroom) {
      throw new NotFoundException(
        `Chatroom with id=${data.chatroomId} not found`,
      );
    }

    const message = new Message(
      data.senderId,
      data.messageBody,
      data.pictureUrl,
    );
    chatroom.addMessage(message);
    chatroom = await chatroom.save();

    return chatroom;
  }

  async logLastActivityForUser(
    data: LogLastActivityForUser,
  ): Promise<Chatroom> {
    let chatroom = await this.ChatroomModel.findOne({
      _id: data.chatroomId,
      users: data.userId,
    } as any);

    if (!chatroom) {
      throw new NotFoundException(
        `Chatroom with id=${data.chatroomId} not found`,
      );
    }

    chatroom.logLastActivityForUser(data.userId);
    chatroom = await chatroom.save();

    return chatroom;
  }
}
