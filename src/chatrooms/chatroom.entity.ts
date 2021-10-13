import { ObjectType, ID, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { User } from '../users/user.entity';
import { useMongoosePlugins } from '../common/useMongoosePlugins';
import { Message } from './message.entity';

@ObjectType()
@useMongoosePlugins()
@modelOptions({ schemaOptions: { timestamps: true } })
export class Chatroom {
  @Field((type) => ID)
  id: string;

  @Field((type) => [Message])
  @prop({ type: () => [Message], default: [] })
  messages!: Message[];

  @Field((type) => Message, { nullable: true })
  get lastMessage(): Message {
    if (this.messages.length === 0) {
      return undefined;
    }

    return this.messages[this.messages.length - 1];
  }

  @Field((type) => [User])
  @prop({ ref: () => User, autopopulate: true })
  users!: Ref<User>[];

  @Field((type) => GraphQLISODateTime)
  createdAt: Date;

  @Field((type) => GraphQLISODateTime)
  updatedAt: Date;

  addMessage(message: Message): void {
    message.chatroom = this;
    this.messages.push(message);
  }
}
