import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import jwtConfig from '../config/jwt.config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [jwtConfig.KEY],
      useFactory: (config: ConfigType<typeof jwtConfig>) => ({
        secret: config.secret,
        verifyOptions: {
          ignoreExpiration: true,
        },
      }),
    }),
  ],
  exports: [PassportModule, JwtModule],
})
@Global()
export class CommonModule {}
