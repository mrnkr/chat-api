import { InputType, Field, ID } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SendMessageDto {
  @Field((type) => ID)
  @IsMongoId()
  chatroomId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  messageBody: string;
}
