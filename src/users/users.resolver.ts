import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from '../auth/current-user.decorator';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserStatusUpdatedSubscriptionPayload } from './interfaces/user-status-updated-subscription-payload.interface';
import { UserStatusUpdatedSubscriptionVariables } from './interfaces/user-status-updated-subscription-variables.interface';

@Resolver((of) => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly pubSub: PubSub,
  ) {}

  @Query((returns) => [User])
  async users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query((returns) => User)
  async user(
    @Args('id')
    id: string,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Query((returns) => User)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() currentUser: User): User {
    return currentUser;
  }

  @Mutation((returns) => String)
  async createUser(@Args('input') args: CreateUserDto): Promise<string> {
    const token = await this.usersService.create(args);
    return token;
  }

  @Mutation((returns) => User)
  @UseGuards(GqlAuthGuard)
  async sendHeartbeat(@CurrentUser() currentUser: User): Promise<User> {
    const user = await this.usersService.sendHeartbeat(currentUser.id);
    await this.pubSub.publish('userStatusUpdated', { userStatusUpdated: user });
    return user;
  }

  @Subscription((returns) => User, {
    filter: (
      payload: UserStatusUpdatedSubscriptionPayload,
      variables: UserStatusUpdatedSubscriptionVariables,
    ) => {
      const user = payload.userStatusUpdated;
      return variables.id === user.id;
    },
  })
  userStatusUpdated(@Args('id') userId: string) {
    return this.pubSub.asyncIterator('userStatusUpdated');
  }
}
