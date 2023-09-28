import { DatabaseConnector } from "infra/database";
import { FrameWorkAdapter } from "./adapters";
import { Env, userRoutes } from "./config";

const framework = new FrameWorkAdapter([...userRoutes], Env.PORT);
const databaseConnector = DatabaseConnector;

databaseConnector.connect(Env.MONGO_URL).then(() => {
  framework.start();
});
