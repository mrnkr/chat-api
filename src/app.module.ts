import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ChatroomsModule } from './chatrooms/chatrooms.module';
import { GraphqlOptions } from './graphql-options.class';

@Module({
  imports: [
    DatabaseModule.forRoot(),
    GraphQLModule.forRootAsync({ useClass: GraphqlOptions }),
    AuthModule,
    ChatroomsModule,
    CommonModule,
    ConfigModule,
    UsersModule,
  ],
})
export class AppModule {}
