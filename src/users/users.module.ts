import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Module({
  imports: [DatabaseModule.forFeature([User])],
  providers: [UsersResolver, UsersService],
  exports: [DatabaseModule],
})
export class UsersModule {}
