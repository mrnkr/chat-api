import { UnauthorizedException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly UserModel: ModelType<User>,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string): Promise<string> {
    const user = await this.UserModel.findOne({ where: { email } });
    const passwordsMatch = await user?.checkPassword(password);

    if (!user || !passwordsMatch) {
      throw new UnauthorizedException();
    }

    return this.jwt.signAsync({ email }, { subject: `${user.id}` });
  }
}
