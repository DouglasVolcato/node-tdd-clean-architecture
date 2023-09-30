import * as dotenv from "dotenv";

export class Env {
  public getVaiables() {
    let PORT = 7777;
    let DB_URL = "";
    try {
      dotenv.config();
      PORT = process.env.PORT ? Number(process.env.PORT) : PORT;
      DB_URL = process.env.DB_URL ? process.env.DB_URL : DB_URL;
    } catch (error) {}
    return {
      PORT,
      DB_URL,
    };
  }
}
