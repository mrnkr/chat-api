import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  connString: process.env.MONGO_CONN_STRING,
}));
