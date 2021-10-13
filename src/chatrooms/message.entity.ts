import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { User } from '../users/user.entity';
import { Chatroom } from './chatroom.entity';

@ObjectType()
@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @Field((type) => ID)
  id: string;

  @Field()
  @prop()
  body: string;

  @Field((type) => ID)
  @prop({ ref: () => Chatroom })
  chatroom: Ref<Chatroom>;

  @Field((type) => ID)
  @prop({ ref: () => User })
  sender: Ref<User>;

  @Field((type) => GraphQLISODateTime)
  createdAt?: Date;

  @Field((type) => GraphQLISODateTime)
  updatedAt?: Date;

  constructor(body: string, senderId: string) {
    this.body = body;
    this.sender = senderId as any;
  }
}
