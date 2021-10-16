import { InputType, Field, ID } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class CreateChatroomDto {
  @Field((type) => ID)
  @IsMongoId()
  userId: string;
}
