import { registerEnumType } from '@nestjs/graphql';

export enum UserStatus {
  Writing = 'Writing',
  Idle = 'Idle',
}

registerEnumType(UserStatus, {
  name: 'UserStatus',
});
