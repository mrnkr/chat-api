import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

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
  @IsOptional()
  pictureUrl?: string;
}
