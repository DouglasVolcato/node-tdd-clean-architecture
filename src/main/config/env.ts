import * as dotenv from "dotenv";

dotenv.config();

export const Env = {
  PORT: Number(process.env.PORT ?? 7777),
  MONGO_URL: process.env.MONGO_URL ?? "",
  MONGO_TEST_URL: process.env.MONGO_TEST_URL ?? "",
};
