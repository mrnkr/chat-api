import { InputType, Field } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SendMessageDto {
  @Field()
  @IsMongoId()
  chatroomId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  messageBody: string;
}
