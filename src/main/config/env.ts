import * as dotenv from "dotenv";

dotenv.config();

export const Env = {
  PORT: Number(process.env.PORT ?? 7777),
  DB_URL: process.env.DB_URL ?? "",
};
