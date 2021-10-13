import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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
          onConnect: (connectionParams) => {
            const token = connectionParams['Authorization'].split(' ').pop();
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
