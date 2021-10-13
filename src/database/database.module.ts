import { DynamicModule, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import {
  TypegooseClass,
  TypegooseClassWithOptions,
} from 'nestjs-typegoose/dist/typegoose-class.interface';
import dbConfig from '../config/db.config';

type EntityClass = TypegooseClass | TypegooseClassWithOptions;

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypegooseModule.forRootAsync({
          inject: [dbConfig.KEY],
          useFactory: (config: ConfigType<typeof dbConfig>) => ({
            uri: config.connString,
          }),
        }),
      ],
    };
  }

  static forFeature(entities: EntityClass[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [TypegooseModule.forFeature(entities)],
      exports: [TypegooseModule],
    };
  }
}
