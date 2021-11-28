import { InputType, Field, ID } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty, IsString, IsUrl } from 'class-validator';

@InputType()
export class SendMessageDto {
  @Field((type) => ID)
  @IsMongoId()
  chatroomId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  messageBody: string;

  @Field({ nullable: true })
  @IsUrl()
  pictureUrl?: string;
}
