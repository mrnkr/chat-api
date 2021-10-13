import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/current-user.decorator';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

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
}
