import { ObjectType, ID, Field, GraphQLISODateTime } from '@nestjs/graphql';
import {
  isDocumentArray,
  modelOptions,
  prop,
  Ref,
  mongoose,
  Severity,
} from '@typegoose/typegoose';
import { User } from '../users/user.entity';
import { useMongoosePlugins } from '../common/use-mongoose-plugins.decorator';
import { Message } from './message.entity';
import { UserStatus } from './user-status.enum';

@ObjectType()
@useMongoosePlugins()
@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
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
  @prop({ ref: () => User, autopopulate: true, index: true })
  users!: Ref<User>[];

  @Field((type) => Object, { nullable: true })
  @prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  status?: { [key: string]: UserStatus };

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

  setStatusForUser(userId: string, status: UserStatus): void {
    if (!this.status) {
      this.status = {};
    }

    this.status[userId] = status;
  }
}
