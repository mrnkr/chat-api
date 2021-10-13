import { InputType, Field } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class CreateChatroomDto {
  @Field((type) => String)
  @IsMongoId()
  userId: string;
}
