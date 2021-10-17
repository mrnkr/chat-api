import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { Chatroom } from './chatroom.entity';
import { ChatroomsResolver } from './chatrooms.resolver';
import { ChatroomsService } from './chatrooms.service';

@Module({
  imports: [DatabaseModule.forFeature([Chatroom]), UsersModule],
  providers: [ChatroomsResolver, ChatroomsService],
})
export class ChatroomsModule {}
