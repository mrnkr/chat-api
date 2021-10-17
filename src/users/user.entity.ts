import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { modelOptions, prop, pre } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';

@pre<User>('save', async function hashPassword() {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
})
@ObjectType()
@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @Field((type) => ID)
  id: string;

  @Field()
  @prop()
  displayName: string;

  @Field()
  @prop({ unique: true })
  email: string;

  @prop()
  password: string;

  @Field((type) => GraphQLISODateTime, { nullable: true })
  @prop({ type: () => Date })
  lastHeartbeatAt?: Date;

  @Field((type) => GraphQLISODateTime)
  createdAt: Date;

  @Field((type) => GraphQLISODateTime)
  updatedAt: Date;

  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  sendHeartbeat(): void {
    this.lastHeartbeatAt = new Date();
  }
}
