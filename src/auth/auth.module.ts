import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [UsersModule],
  providers: [AuthResolver, AuthService, JwtStrategy],
})
export class AuthModule {}
