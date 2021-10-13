import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { prop, Ref } from '@typegoose/typegoose';
import { User } from '../users/user.entity';
import { Chatroom } from './chatroom.entity';

@ObjectType()
export class Message {
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
  createdAt: Date;

  constructor(body: string, senderId: string) {
    this.body = body;
    this.sender = senderId as any;
    this.createdAt = new Date();
  }
}
