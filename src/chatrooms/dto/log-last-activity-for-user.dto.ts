import { Field, ID, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class LogLastActivityForUserDto {
  @Field((type) => ID)
  @IsMongoId()
  chatroomId: string;
}
