import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Resolver('auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation((returns) => String)
  async login(@Args('input') input: LoginDto): Promise<string> {
    const token = await this.authService.login(input.email, input.password);
    return token;
  }
}
