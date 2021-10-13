import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { Chatroom } from './chatroom.entity';
import { ChatroomsResolver } from './chatrooms.resolver';
import { ChatroomsService } from './chatrooms.service';

@Module({
  imports: [DatabaseModule.forFeature([Chatroom]), UsersModule],
  providers: [
    {
      provide: PubSub,
      useValue: new PubSub(),
    },
    ChatroomsResolver,
    ChatroomsService,
  ],
})
export class ChatroomsModule {}
