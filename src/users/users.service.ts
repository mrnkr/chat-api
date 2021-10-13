import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly UserModel: ModelType<User>,
    private readonly jwt: JwtService,
  ) {}

  async create(dto: CreateUserDto): Promise<string> {
    let user = new this.UserModel({
      displayName: dto.displayName,
      email: dto.email,
      password: dto.password,
    });

    user = await user.save();
    return this.jwt.signAsync({ email: user.email }, { subject: user.id });
  }

  async findAll(): Promise<User[]> {
    return await this.UserModel.find();
  }

  async findOneById(id: string): Promise<User> {
    return await this.UserModel.findById(id);
  }
}
