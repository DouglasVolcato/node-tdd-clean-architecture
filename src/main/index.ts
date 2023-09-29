import { DatabaseConnector } from "../infra/database";
import { FrameWorkAdapter } from "./adapters";
import { Env, userRoutes } from "./config";

const framework = new FrameWorkAdapter([...userRoutes], Env.PORT);
const databaseConnector = new DatabaseConnector();

databaseConnector.connect(Env.DB_URL).then(() => {
  framework.start();
});
