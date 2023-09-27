import { DatabaseConnector } from "infra/database";
import { FrameWorkAdapter } from "./adapters";
import { Env, routes } from "./config";

const framework = new FrameWorkAdapter(routes, Env.PORT);
const databaseConnector = DatabaseConnector;

databaseConnector.connect(Env.MONGO_URL).then(() => {
  framework.start();
});
