import { Module } from '@nestjs/common';
import { ConfigModule as NativeConfigModule } from '@nestjs/config';
import { validate } from './env.validation';
import appConfig from './app.config';
import dbConfig from './db.config';
import jwtConfig from './jwt.config';

@Module({
  imports: [
    NativeConfigModule.forRoot({
      validate,
      isGlobal: true,
      load: [appConfig, dbConfig, jwtConfig],
    }),
  ],
})
export class ConfigModule {}
