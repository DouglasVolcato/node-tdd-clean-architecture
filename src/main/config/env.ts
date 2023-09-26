import * as dotenv from 'dotenv'

dotenv.config();

export const Env = {
  MONGO_TEST_URL: process.env.MONGO_TEST_URL ?? '',
  MONGO_URL: process.env.MONGO_URL ?? '',
};
