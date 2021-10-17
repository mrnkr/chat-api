import { ObjectType, ID, Field, GraphQLISODateTime } from '@nestjs/graphql';
import {
  isDocumentArray,
  modelOptions,
  prop,
  Ref,
  mongoose,
  Severity,
  index,
} from '@typegoose/typegoose';
import { User } from '../users/user.entity';
import { useMongoosePlugins } from '../common/use-mongoose-plugins.decorator';
import { Message } from './message.entity';

@ObjectType()
@useMongoosePlugins()
@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
@index({ 'users.0': 1, 'users.1': 1 }, { unique: true })
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

  @Field((type) => Object, { nullable: true })
  @prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  lastActivity?: { [key: string]: Date };

  @Field((type) => GraphQLISODateTime)
  createdAt: Date;

  @Field((type) => GraphQLISODateTime)
  updatedAt: Date;

  addMessage(message: Message): void {
    message.chatroom = this;
    this.messages.push(message);
  }

  canAccess(userId: string): boolean {
    if (!isDocumentArray(this.users)) {
      // deny access if check cannot be performed
      return false;
    }

    return this.users.some((u) => u.id === userId);
  }

  logLastActivityForUser(userId: string): void {
    if (!this.lastActivity) {
      this.lastActivity = {};
    }

    this.lastActivity[userId] = new Date();
  }
}
