import * as dotenv from "dotenv";

export class Env {
  public getVariables() {
    let PORT = 7777;
    let DB_URL = "";
    let SECRET = "384f83ny48yr384yr8";
    try {
      dotenv.config();
      PORT = process.env.PORT ? Number(process.env.PORT) : PORT;
      DB_URL = process.env.DB_URL ? process.env.DB_URL : DB_URL;
      SECRET = process.env.SECRET ? process.env.SECRET : SECRET;
    } catch (error) {}
    return {
      PORT,
      DB_URL,
      SECRET
    };
  }
}
