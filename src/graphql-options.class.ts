import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsConnectionParams } from './common/interfaces/ws-connection-params.interface';

@Injectable()
export class GraphqlOptions implements GqlOptionsFactory {
  constructor(private readonly jwt: JwtService) {}

  createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions {
    return {
      autoSchemaFile: true,
      path: 'api/graphql',
      installSubscriptionHandlers: true,
      subscriptions: {
        'subscriptions-transport-ws': {
          path: '/api/graphql',
          onConnect: (connectionParams: WsConnectionParams) => {
            const token = connectionParams.Authorization.split(' ').pop();
            const { sub } = this.jwt.decode(token);
            return {
              currentUser: sub,
            };
          },
        },
      },
    };
  }
}
