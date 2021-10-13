import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import { InjectModel } from 'nestjs-typegoose';
import { User } from '../users/user.entity';
import jwtConfig from '../config/jwt.config';
import { JwtPayload } from './interfaces/jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User)
    private readonly UserModel: ModelType<User>,
    @Inject(jwtConfig.KEY)
    config: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.secret,
    });
  }

  async validate({ sub }: JwtPayload): Promise<User> {
    const user = await this.UserModel.findById(sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
