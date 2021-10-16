import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import jwtConfig from '../config/jwt.config';
import { GraphQLJSONObject } from './graphql-json-object.scalar';

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
  providers: [GraphQLJSONObject],
  exports: [PassportModule, JwtModule],
})
@Global()
export class CommonModule {}
