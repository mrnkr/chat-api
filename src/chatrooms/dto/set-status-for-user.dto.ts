import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsMongoId } from 'class-validator';
import { UserStatus } from '../user-status.enum';

@InputType()
export class SetStatusForUserDto {
  @Field((type) => ID)
  @IsMongoId()
  chatroomId: string;

  @Field((type) => UserStatus)
  @IsEnum(UserStatus)
  status: UserStatus;
}
