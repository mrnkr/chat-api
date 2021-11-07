import { Field, ID, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { CreateChatroomDto } from './create-chatroom.dto';

@InputType()
export class AddToChatroomDto extends CreateChatroomDto {
  @Field((type) => ID)
  @IsMongoId()
  chatroomId: string;
}
